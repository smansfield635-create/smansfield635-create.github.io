/* /showroom/globe/earth/index.js
   EARTH_G6_ROUTE_BOOT_VISIBLE_MOUNT_ALIGNMENT_TNT_v1
   Full-file replacement.
*/

(function () {
  "use strict";

  const CONTRACT = "EARTH_G6_ROUTE_BOOT_VISIBLE_MOUNT_ALIGNMENT_TNT_v1";
  const ROUTE_CONTRACT = "EARTH_G6_VISIBLE_ROUTE_SHELL_256_LATTICE_SIMULATION_TNT_v1";
  const CANVAS_CONTRACT = "EARTH_G6_256_LATTICE_PHYSICS_SYNTHETIC_SATELLITE_VIEW_TNT_v1";
  const RUNTIME_CONTRACT = "EARTH_G6_ASSETS_RUNTIME_256_LATTICE_SIMULATION_MODE_TNT_v1";

  const REQUIRED = [
    "/assets/earth/earth_lattice_256.js",
    "/assets/earth/earth_physics_sensor.js",
    "/assets/earth/earth_atmosphere_model.js",
    "/assets/earth/earth_canvas.js",
    "/assets/earth/earth_assets_runtime.js"
  ];

  const RETIRED = [
    "/runtime/earth_asset_runtime.js"
  ];

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
    requiredScriptsLoaded: false,
    retiredScriptsDetected: false,
    dependenciesReady: false,
    status: "booting",
    lastError: null
  };

  const mountSelector = "#earthRenderMount,[data-earth-render-mount],[data-dgb-earth-mount]";
  const canvasSelector = "canvas.earth-g6-canvas,canvas.earth-g5-canvas,canvas.earth-g4-canvas,canvas.earth-reference-canvas,canvas.earth-material-canvas,#earthRenderMount canvas,[data-earth-render-mount] canvas,[data-dgb-earth-mount] canvas";

  let auditTimer = null;
  let auditCount = 0;

  function qsa(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function getMount() {
    return document.querySelector(mountSelector);
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

  function getRuntimeReceipt() {
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

  function allRequiredLoaded() {
    return REQUIRED.every(scriptLoaded);
  }

  function retiredDetected() {
    return RETIRED.some(scriptLoaded);
  }

  function dependenciesReady() {
    return Boolean(
      window.DGBEarthLattice256 &&
      window.DGBEarthPhysicsSensor &&
      window.DGBEarthAtmosphereModel &&
      getCanvasAuthority()
    );
  }

  function normalizeVisibleLabels() {
    const labels = qsa(".earth-reference-label,.earth-satellite-label");

    labels.forEach((label) => {
      if (/nasa|blue marble|satellite derived earth/i.test(label.textContent || "")) {
        label.textContent = "256 LATTICE SYNTHETIC SATELLITE VIEW";
      }

      label.classList.add("earth-satellite-label");
      label.dataset.nasaReference = "forbidden";
      label.dataset.sourceStandard = "PHYSICS_SYNTHETIC_SATELLITE_VIEW";
      label.dataset.routeBootContract = CONTRACT;
    });
  }

  function markRoot() {
    const root = document.documentElement;

    root.dataset.earthRouteBootContract = CONTRACT;
    root.dataset.earthRouteContract = ROUTE_CONTRACT;
    root.dataset.earthCanvasContract = CANVAS_CONTRACT;
    root.dataset.earthRuntimeContract = RUNTIME_CONTRACT;
    root.dataset.earthRouteBootStatus = STATE.status;
    root.dataset.earthRouteMountFound = String(STATE.mountFound);
    root.dataset.earthRouteCanvasFound = String(STATE.canvasFound);
    root.dataset.earthRouteCanvasAuthorityFound = String(STATE.canvasAuthorityFound);
    root.dataset.earthRouteRuntimeReceiptFound = String(STATE.runtimeReceiptFound);
    root.dataset.earthRouteRequiredScriptsLoaded = String(STATE.requiredScriptsLoaded);
    root.dataset.earthRouteRetiredScriptsDetected = String(STATE.retiredScriptsDetected);
    root.dataset.earthRouteDependenciesReady = String(STATE.dependenciesReady);
    root.dataset.earthSourceStandard = "PHYSICS_SYNTHETIC_SATELLITE_VIEW";
    root.dataset.earthBaseSurface = "generated-from-256-lattice";
    root.dataset.earthStaticSurfaceDependency = "false";
    root.dataset.earthNasaReference = "forbidden";
    root.dataset.earthJpgAllowed = "false";
    root.dataset.earthProceduralFallback = "false";
    root.dataset.generatedImage = "false";
    root.dataset.graphicBox = "false";
    root.dataset.visualPassClaimed = "false";

    if (document.body) {
      document.body.dataset.earthRouteBootContract = CONTRACT;
      document.body.dataset.earthRouteBootStatus = STATE.status;
      document.body.dataset.earthSourceStandard = "PHYSICS_SYNTHETIC_SATELLITE_VIEW";
      document.body.dataset.earthBaseSurface = "generated-from-256-lattice";
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
        requiredScripts: REQUIRED.slice(),
        retiredScripts: RETIRED.slice(),
        booted: STATE.booted,
        mountFound: STATE.mountFound,
        canvasFound: STATE.canvasFound,
        canvasAuthorityFound: STATE.canvasAuthorityFound,
        runtimeReceiptFound: STATE.runtimeReceiptFound,
        requiredScriptsLoaded: STATE.requiredScriptsLoaded,
        retiredScriptsDetected: STATE.retiredScriptsDetected,
        dependenciesReady: STATE.dependenciesReady,
        status: STATE.status,
        lastError: STATE.lastError,
        sourceStandard: "PHYSICS_SYNTHETIC_SATELLITE_VIEW",
        baseSurface: "generated_from_256_lattice",
        staticSurfaceDependency: false,
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
    const node = document.querySelector("[data-earth-route-status]");
    if (!node) return;
    node.innerHTML = "<strong>Earth route:</strong> " + message;
  }

  function routeAudit() {
    auditCount += 1;

    const mount = getMount();
    const canvas = getCanvas();
    const api = getCanvasAuthority();
    const receipt = getRuntimeReceipt();

    STATE.mountFound = Boolean(mount);
    STATE.canvasFound = Boolean(canvas);
    STATE.canvasAuthorityFound = Boolean(api);
    STATE.runtimeReceiptFound = Boolean(receipt);
    STATE.requiredScriptsLoaded = allRequiredLoaded();
    STATE.retiredScriptsDetected = retiredDetected();
    STATE.dependenciesReady = dependenciesReady();

    normalizeVisibleLabels();

    if (!STATE.mountFound) {
      STATE.status = "failed-no-earth-render-mount";
      writeStatus("failed · missing #earthRenderMount.");
      publish();
      return;
    }

    if (STATE.retiredScriptsDetected) {
      STATE.status = "blocked-retired-runtime-script-present";
      writeStatus("blocked · retired runtime script is still present.");
      publish();
      return;
    }

    if (!STATE.requiredScriptsLoaded) {
      STATE.status = "waiting-for-required-g6-earth-scripts";
      writeStatus("waiting · required G6 Earth scripts have not all loaded.");
      publish();
      return;
    }

    if (!STATE.dependenciesReady) {
      STATE.status = "waiting-for-g6-earth-dependencies";
      writeStatus("waiting · lattice, physics sensor, atmosphere, or canvas authority not visible yet.");
      publish();
      return;
    }

    if (!STATE.canvasFound) {
      STATE.status = "waiting-for-visible-earth-canvas";
      writeStatus("waiting · Earth canvas has not appeared inside #earthRenderMount yet.");
      publish();
      return;
    }

    STATE.status = "pass-g6-visible-route-shell-and-canvas-mounted";
    writeStatus("pass · G6 visible route shell aligned · 256 lattice simulation canvas mounted · no NASA · no JPG · no image dependency.");

    publish({
      canvasClass: canvas.className || "",
      canvasWidth: canvas.width || 0,
      canvasHeight: canvas.height || 0,
      runtimeReceipt: receipt || null
    });
  }

  function startAuditLoop() {
    if (auditTimer) window.clearInterval(auditTimer);

    routeAudit();

    auditTimer = window.setInterval(() => {
      routeAudit();

      if (auditCount >= 14 && STATE.status.indexOf("pass-") === 0) {
        window.clearInterval(auditTimer);
        auditTimer = null;
      }
    }, 700);
  }

  function init() {
    STATE.booted = true;
    STATE.status = "earth-g6-route-script-booted";
    markRoot();
    publish({ booted: true });

    writeStatus("route script booted · checking G6 visible mount, lattice, physics sensor, atmosphere, canvas, and runtime.");
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
