/* /showroom/globe/earth/index.js
   EARTH_G5_ROUTE_BOOT_CHAIN_ALIGNMENT_TNT_v1
   Full-file replacement.

   Purpose:
   - Route boot chain only.
   - Confirms the Earth route shell has loaded the G5 Earth asset-family runtime.
   - Detects retired /runtime/earth_asset_runtime.js path.
   - Does not own Earth canvas projection.
   - Does not own Earth material CSS.
   - Does not own Earth manifest truth.
   - Does not render Audralia.
   - Does not touch Gauges, Products, Sun, Moon, or global files.
   - No GraphicBox. No image generation. No visual-pass claim.
*/

(function () {
  "use strict";

  const CONTRACT = "EARTH_G5_ROUTE_BOOT_CHAIN_ALIGNMENT_TNT_v1";
  const ROUTE_CONTRACT = "EARTH_G5_SATELLITE_DERIVED_ROUTE_SHELL_TNT_v1";
  const CANVAS_CONTRACT = "EARTH_G5_NON_NASA_SATELLITE_DERIVED_NATURAL_GLOBE_TNT_v1";
  const RUNTIME_CONTRACT = "EARTH_G5_EARTH_ASSETS_RUNTIME_FAMILY_PLACEMENT_TNT_v4";

  const REQUIRED_RUNTIME = "/assets/earth/earth_assets_runtime.js";
  const RETIRED_RUNTIME = "/runtime/earth_asset_runtime.js";
  const REQUIRED_SURFACE = "/assets/earth/earth_surface_satellite.png";
  const REQUIRED_CLOUDS = "/assets/earth/earth_clouds_satellite.png";

  const STATE = {
    contract: CONTRACT,
    routeContract: ROUTE_CONTRACT,
    canvasContract: CANVAS_CONTRACT,
    runtimeContract: RUNTIME_CONTRACT,
    route: "/showroom/globe/earth/",
    booted: false,
    mountFound: false,
    canvasFound: false,
    canvasAuthorityFound: false,
    runtimeReceiptFound: false,
    requiredRuntimeLoaded: false,
    retiredRuntimeDetected: false,
    surfaceLoaded: false,
    cloudLoaded: false,
    surfaceMode: "unread",
    cloudMode: "unread",
    status: "booting",
    lastError: null
  };

  const mountSelector = "#earthRenderMount,[data-earth-render-mount],[data-dgb-earth-mount]";
  const canvasSelector = "canvas.earth-g5-canvas,canvas.earth-g4-canvas,canvas.earth-reference-canvas,canvas.earth-material-canvas,#earthRenderMount canvas,[data-earth-render-mount] canvas,[data-dgb-earth-mount] canvas";

  let auditTimer = null;
  let auditCount = 0;

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function getMount() {
    return qs(mountSelector);
  }

  function getCanvas() {
    const mount = getMount();
    return mount ? mount.querySelector(canvasSelector) : null;
  }

  function getCanvasAuthority() {
    return window.DGBEarthCanvas ||
      window.DGBEarthCanvasAuthority ||
      window.EarthCanvas ||
      window.earthCanvas ||
      null;
  }

  function runtimeReceipt() {
    return window.DGB_EARTH_ASSETS_RUNTIME_RECEIPT ||
      window.DGB_EARTH_ASSET_RUNTIME_RECEIPT ||
      null;
  }

  function scriptLoaded(path) {
    return qsa("script[src]").some((script) => {
      const src = script.getAttribute("src") || "";
      return src.indexOf(path) !== -1;
    });
  }

  function normalizeVisibleLabels() {
    const mount = getMount();
    if (!mount) return;

    const labels = qsa(".earth-reference-label,.earth-satellite-label");

    labels.forEach((label) => {
      if (/nasa|blue marble/i.test(label.textContent || "")) {
        label.textContent = "SATELLITE DERIVED EARTH";
      }

      label.classList.add("earth-satellite-label");
      label.dataset.nasaReference = "forbidden";
      label.dataset.sourceStandard = "NON_NASA_SATELLITE_DERIVED_NATURAL_GLOBE";
      label.dataset.routeBootContract = CONTRACT;
    });
  }

  function markRoot() {
    const root = document.documentElement;

    root.dataset.earthRouteBootContract = CONTRACT;
    root.dataset.earthRouteContract = ROUTE_CONTRACT;
    root.dataset.earthCanvasContract = CANVAS_CONTRACT;
    root.dataset.earthRuntimeContract = RUNTIME_CONTRACT;
    root.dataset.earthRuntimeAuthority = REQUIRED_RUNTIME;
    root.dataset.earthRetiredRuntimeAuthority = RETIRED_RUNTIME;
    root.dataset.earthRouteBootStatus = STATE.status;
    root.dataset.earthRouteMountFound = String(STATE.mountFound);
    root.dataset.earthRouteCanvasFound = String(STATE.canvasFound);
    root.dataset.earthRouteCanvasAuthorityFound = String(STATE.canvasAuthorityFound);
    root.dataset.earthRouteRuntimeReceiptFound = String(STATE.runtimeReceiptFound);
    root.dataset.earthRouteRequiredRuntimeLoaded = String(STATE.requiredRuntimeLoaded);
    root.dataset.earthRouteRetiredRuntimeDetected = String(STATE.retiredRuntimeDetected);
    root.dataset.earthRouteSurfaceLoaded = String(STATE.surfaceLoaded);
    root.dataset.earthRouteCloudLoaded = String(STATE.cloudLoaded);
    root.dataset.earthSourceStandard = "NON_NASA_SATELLITE_DERIVED_NATURAL_GLOBE";
    root.dataset.earthNasaReference = "forbidden";
    root.dataset.earthJpgAllowed = "false";
    root.dataset.earthProceduralFallback = "false";
    root.dataset.generatedImage = "false";
    root.dataset.graphicBox = "false";
    root.dataset.visualPassClaimed = "false";

    if (document.body) {
      document.body.dataset.earthRouteBootContract = CONTRACT;
      document.body.dataset.earthRouteBootStatus = STATE.status;
      document.body.dataset.earthSourceStandard = "NON_NASA_SATELLITE_DERIVED_NATURAL_GLOBE";
      document.body.dataset.generatedImage = "false";
      document.body.dataset.graphicBox = "false";
      document.body.dataset.visualPassClaimed = "false";
    }
  }

  function publish(extra) {
    window.DGB_EARTH_ROUTE_BOOT_RECEIPT = Object.assign(
      {
        contract: CONTRACT,
        routeContract: ROUTE_CONTRACT,
        canvasContract: CANVAS_CONTRACT,
        runtimeContract: RUNTIME_CONTRACT,
        route: "/showroom/globe/earth/",
        requiredRuntime: REQUIRED_RUNTIME,
        retiredRuntime: RETIRED_RUNTIME,
        requiredSurface: REQUIRED_SURFACE,
        requiredClouds: REQUIRED_CLOUDS,
        booted: STATE.booted,
        mountFound: STATE.mountFound,
        canvasFound: STATE.canvasFound,
        canvasAuthorityFound: STATE.canvasAuthorityFound,
        runtimeReceiptFound: STATE.runtimeReceiptFound,
        requiredRuntimeLoaded: STATE.requiredRuntimeLoaded,
        retiredRuntimeDetected: STATE.retiredRuntimeDetected,
        surfaceLoaded: STATE.surfaceLoaded,
        cloudLoaded: STATE.cloudLoaded,
        surfaceMode: STATE.surfaceMode,
        cloudMode: STATE.cloudMode,
        status: STATE.status,
        lastError: STATE.lastError,
        owns: [
          "earth_route_shell_boot_confirmation",
          "earth_route_script_presence",
          "earth_runtime_path_detection",
          "earth_route_status_reporting",
          "earth_visible_label_normalization"
        ],
        doesNotOwn: [
          "earth_canvas_projection",
          "earth_surface_sampling",
          "earth_cloud_sampling",
          "earth_material_styling",
          "earth_manifest_truth",
          "Audralia",
          "Gauges",
          "Products",
          "Sun",
          "Moon",
          "global_files",
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
      window.dispatchEvent(new CustomEvent("dgb:earth-route-boot", {
        detail: window.DGB_EARTH_ROUTE_BOOT_RECEIPT
      }));
    } catch (error) {}
  }

  function writeStatus(message) {
    const node = qs("[data-earth-route-status]");
    if (!node) return;

    node.innerHTML = "<strong>Earth route:</strong> " + message;
  }

  function readRuntimeReceipt() {
    const receipt = runtimeReceipt();

    STATE.runtimeReceiptFound = Boolean(receipt);

    if (!receipt) return;

    if (receipt.runtimeStatus) STATE.status = receipt.runtimeStatus;

    if (receipt.surfaceLoaded !== undefined) STATE.surfaceLoaded = Boolean(receipt.surfaceLoaded);
    if (receipt.cloudsPrimaryLoaded !== undefined) STATE.cloudLoaded = Boolean(receipt.cloudsPrimaryLoaded);
    if (receipt.surfaceMode) STATE.surfaceMode = receipt.surfaceMode;
    if (receipt.cloudMode) STATE.cloudMode = receipt.cloudMode;

    if (receipt.assetStatus && receipt.assetStatus.surface) {
      STATE.surfaceLoaded = Boolean(receipt.assetStatus.surface.ok);
      STATE.surfaceMode = receipt.assetStatus.surface.mode || STATE.surfaceMode;
    }

    if (receipt.assetStatus && receipt.assetStatus.cloudsPrimary) {
      STATE.cloudLoaded = Boolean(receipt.assetStatus.cloudsPrimary.ok);
      STATE.cloudMode = receipt.assetStatus.cloudsPrimary.mode || STATE.cloudMode;
    }
  }

  function verifyDirectly(api) {
    if (!api || typeof api.verifyAssets !== "function") {
      return Promise.resolve(false);
    }

    return api.verifyAssets()
      .then((result) => {
        if (result && result.surface) {
          STATE.surfaceLoaded = Boolean(result.surface.ok);
          STATE.surfaceMode = result.surface.mode || STATE.surfaceMode;
        }

        if (result && result.cloudsPrimary) {
          STATE.cloudLoaded = Boolean(result.cloudsPrimary.ok);
          STATE.cloudMode = result.cloudsPrimary.mode || STATE.cloudMode;
        }

        return true;
      })
      .catch((error) => {
        STATE.lastError = error && error.message ? error.message : "verifyAssets failed";
        return false;
      });
  }

  function routeAudit() {
    auditCount += 1;

    const mount = getMount();
    const canvas = getCanvas();
    const api = getCanvasAuthority();

    STATE.mountFound = Boolean(mount);
    STATE.canvasFound = Boolean(canvas);
    STATE.canvasAuthorityFound = Boolean(api);
    STATE.requiredRuntimeLoaded = scriptLoaded(REQUIRED_RUNTIME);
    STATE.retiredRuntimeDetected = scriptLoaded(RETIRED_RUNTIME);

    normalizeVisibleLabels();
    readRuntimeReceipt();

    if (!STATE.mountFound) {
      STATE.status = "failed-no-earth-render-mount";
      writeStatus("failed · missing #earthRenderMount.");
      publish();
      return;
    }

    if (STATE.retiredRuntimeDetected) {
      STATE.status = "blocked-retired-runtime-script-present";
      writeStatus("blocked · retired runtime path is still present: " + RETIRED_RUNTIME);
      publish();
      return;
    }

    if (!STATE.requiredRuntimeLoaded) {
      STATE.status = "blocked-earth-assets-runtime-not-loaded";
      writeStatus("blocked · required runtime is not loaded: " + REQUIRED_RUNTIME);
      publish();
      return;
    }

    if (!STATE.canvasAuthorityFound) {
      STATE.status = "waiting-for-earth-canvas-authority";
      writeStatus("waiting · Earth canvas authority not visible yet.");
      publish();
      return;
    }

    verifyDirectly(api).then(() => {
      const nextCanvas = getCanvas();

      STATE.canvasFound = Boolean(nextCanvas);

      if (!STATE.canvasFound) {
        STATE.status = "waiting-for-earth-canvas";
        writeStatus("waiting · Earth canvas has not mounted yet.");
      } else if (!STATE.surfaceLoaded) {
        STATE.status = "blocked-missing-satellite-surface-png";
        writeStatus("blocked · missing or unreadable required PNG: " + REQUIRED_SURFACE);
      } else {
        STATE.status = "pass-earth-route-boot-chain-aligned";
        writeStatus(
          "pass · Earth G5 route aligned · surface=" +
          STATE.surfaceMode +
          " · clouds=" +
          (STATE.cloudLoaded ? STATE.cloudMode : "optional-missing") +
          " · runtime=" +
          REQUIRED_RUNTIME
        );
      }

      publish();
    });
  }

  function startAuditLoop() {
    if (auditTimer) window.clearInterval(auditTimer);

    routeAudit();

    auditTimer = window.setInterval(() => {
      routeAudit();

      if (auditCount >= 12 && STATE.status.indexOf("pass-") === 0) {
        window.clearInterval(auditTimer);
        auditTimer = null;
      }
    }, 700);
  }

  function init() {
    STATE.booted = true;
    STATE.status = "earth-route-script-booted";
    markRoot();
    publish({ booted: true });

    writeStatus("route script booted · checking asset-family runtime and satellite PNG.");
    startAuditLoop();
  }

  window.addEventListener("dgb:earth-canvas-ready", routeAudit);
  window.addEventListener("dgb:earth-assets-runtime", routeAudit);
  window.addEventListener("dgb:earth-asset-runtime", routeAudit);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
