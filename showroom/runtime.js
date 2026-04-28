/* TNT RENEWAL — /showroom/runtime.js
   SHOWROOM RUNTIME · v1

   CONTRACT:
   - Runtime authority only.
   - Does not render Earth.
   - Does not initialize Earth.
   - Does not move layout.
   - Does not change Earth canvas projection.
   - Does not change Earth assets.
   - Confirms Showroom shell, render mount, inspect route, and receipt health.
*/

(function () {
  "use strict";

  var VERSION = "showroom-runtime-v1";
  var INSPECT_ROUTE = "/showroom/globe/";
  var RENDER_CONTROLLER = "/showroom/globe/index.js";
  var EARTH_CANVAS = "/assets/earth/earth_canvas.js";
  var EARTH_MATERIAL = "/assets/earth/earth_material.css";
  var EARTH_SURFACE = "/assets/earth/earth_surface_2048.jpg";
  var EARTH_CLOUDS = "/assets/earth/earth_clouds_2048.jpg";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function pathFromUrl(value) {
    if (!value) return "";

    try {
      return new URL(value, window.location.origin).pathname;
    } catch (error) {
      return String(value).split("?")[0].split("#")[0];
    }
  }

  function findScript(pathname) {
    return Array.prototype.slice.call(document.scripts || []).some(function (script) {
      return pathFromUrl(script.getAttribute("src")) === pathname;
    });
  }

  function findStylesheet(pathname) {
    return Array.prototype.slice.call(document.querySelectorAll('link[rel~="stylesheet"]')).some(function (link) {
      return pathFromUrl(link.getAttribute("href")) === pathname;
    });
  }

  function bool(value) {
    return value ? "true" : "false";
  }

  function setDataset(target, key, value) {
    if (!target) return;
    target.setAttribute(key, String(value));
  }

  function getMount() {
    return document.getElementById("showroom-globe-mount");
  }

  function getRoot() {
    return document.getElementById("showroom-root");
  }

  function getInspectLink() {
    return document.querySelector('a[href="/showroom/globe/"]');
  }

  function getAuditSource() {
    return document.querySelector(".audit-source");
  }

  function ensureAuditReceipt(name, value) {
    var audit = getAuditSource();

    if (!audit) return;

    var selector = '[data-showroom-runtime-receipt="' + name + '"]';
    var existing = audit.querySelector(selector);

    if (!existing) {
      existing = document.createElement("span");
      existing.setAttribute("data-showroom-runtime-receipt", name);
      audit.appendChild(existing);
    }

    existing.textContent = name + "=" + value;
  }

  function markRuntimeBase() {
    var root = getRoot();
    var mount = getMount();

    document.documentElement.setAttribute("data-showroom-runtime", "active");
    document.documentElement.setAttribute("data-showroom-runtime-version", VERSION);
    document.documentElement.setAttribute("data-showroom-mode", "presentation");
    document.documentElement.setAttribute("data-showroom-parent-route", "/showroom/");
    document.documentElement.setAttribute("data-showroom-origin-route", "/");
    document.documentElement.setAttribute("data-showroom-inspect-route", INSPECT_ROUTE);
    document.documentElement.setAttribute("data-showroom-runtime-role", "receipt-and-handoff-only");

    if (document.body) {
      document.body.setAttribute("data-showroom-runtime", "active");
      document.body.setAttribute("data-showroom-runtime-version", VERSION);
      document.body.setAttribute("data-showroom-mode", "presentation");
      document.body.setAttribute("data-showroom-parent-route", "/showroom/");
      document.body.setAttribute("data-showroom-origin-route", "/");
      document.body.setAttribute("data-showroom-inspect-route", INSPECT_ROUTE);
      document.body.setAttribute("data-showroom-runtime-role", "receipt-and-handoff-only");
    }

    setDataset(root, "data-showroom-runtime", "active");
    setDataset(root, "data-showroom-runtime-version", VERSION);
    setDataset(root, "data-showroom-mode", "presentation");
    setDataset(root, "data-showroom-inspect-route", INSPECT_ROUTE);

    setDataset(mount, "data-showroom-runtime", "active");
    setDataset(mount, "data-showroom-runtime-version", VERSION);
  }

  function measure() {
    var root = getRoot();
    var mount = getMount();
    var inspectLink = getInspectLink();

    var hasRoot = Boolean(root);
    var hasMount = Boolean(mount);
    var hasInspectLink = Boolean(inspectLink);
    var hasEarthCanvasScript = findScript(EARTH_CANVAS);
    var hasRendererScript = findScript(RENDER_CONTROLLER);
    var hasRuntimeScript = findScript("/showroom/runtime.js");
    var hasEarthMaterial = findStylesheet(EARTH_MATERIAL);
    var hasShowroomCss = findStylesheet("/showroom/showroom.css");

    var renderStatus = mount ? (mount.getAttribute("data-render-status") || "unreported") : "missing-mount";
    var earthRuntimeStatus = mount ? (mount.getAttribute("data-earth-runtime-status") || "unreported") : "missing-mount";
    var earthProjection = mount ? (mount.getAttribute("data-earth-projection") || "unreported") : "missing-mount";
    var earthStandard = mount ? (mount.getAttribute("data-earth-standard") || "unreported") : "missing-mount";

    document.documentElement.setAttribute("data-showroom-root-present", bool(hasRoot));
    document.documentElement.setAttribute("data-showroom-globe-mount-present", bool(hasMount));
    document.documentElement.setAttribute("data-showroom-inspect-link-present", bool(hasInspectLink));
    document.documentElement.setAttribute("data-showroom-earth-canvas-script-present", bool(hasEarthCanvasScript));
    document.documentElement.setAttribute("data-showroom-render-controller-script-present", bool(hasRendererScript));
    document.documentElement.setAttribute("data-showroom-runtime-script-present", bool(hasRuntimeScript));
    document.documentElement.setAttribute("data-showroom-earth-material-link-present", bool(hasEarthMaterial));
    document.documentElement.setAttribute("data-showroom-css-present", bool(hasShowroomCss));
    document.documentElement.setAttribute("data-showroom-render-status", renderStatus);
    document.documentElement.setAttribute("data-showroom-earth-runtime-status", earthRuntimeStatus);
    document.documentElement.setAttribute("data-showroom-earth-projection", earthProjection);
    document.documentElement.setAttribute("data-showroom-earth-standard-live", earthStandard);

    if (document.body) {
      document.body.setAttribute("data-showroom-root-present", bool(hasRoot));
      document.body.setAttribute("data-showroom-globe-mount-present", bool(hasMount));
      document.body.setAttribute("data-showroom-inspect-link-present", bool(hasInspectLink));
      document.body.setAttribute("data-showroom-render-status", renderStatus);
    }

    if (mount) {
      mount.setAttribute("data-showroom-runtime-measured", "true");
      mount.setAttribute("data-showroom-runtime-render-status", renderStatus);
    }

    ensureAuditReceipt("showroom-runtime", "active");
    ensureAuditReceipt("showroom-runtime-version", VERSION);
    ensureAuditReceipt("showroom-mode", "presentation");
    ensureAuditReceipt("showroom-root-present", bool(hasRoot));
    ensureAuditReceipt("showroom-globe-mount-present", bool(hasMount));
    ensureAuditReceipt("showroom-inspect-link-present", bool(hasInspectLink));
    ensureAuditReceipt("showroom-earth-canvas-script-present", bool(hasEarthCanvasScript));
    ensureAuditReceipt("showroom-render-controller-script-present", bool(hasRendererScript));
    ensureAuditReceipt("showroom-runtime-script-present", bool(hasRuntimeScript));
    ensureAuditReceipt("showroom-earth-material-link-present", bool(hasEarthMaterial));
    ensureAuditReceipt("showroom-css-present", bool(hasShowroomCss));
    ensureAuditReceipt("showroom-render-status", renderStatus);
    ensureAuditReceipt("showroom-earth-runtime-status", earthRuntimeStatus);
    ensureAuditReceipt("showroom-earth-projection", earthProjection);
    ensureAuditReceipt("showroom-earth-standard", earthStandard);
    ensureAuditReceipt("showroom-inspect-route", INSPECT_ROUTE);

    return {
      hasRoot: hasRoot,
      hasMount: hasMount,
      hasInspectLink: hasInspectLink,
      hasEarthCanvasScript: hasEarthCanvasScript,
      hasRendererScript: hasRendererScript,
      hasRuntimeScript: hasRuntimeScript,
      hasEarthMaterial: hasEarthMaterial,
      hasShowroomCss: hasShowroomCss,
      renderStatus: renderStatus,
      earthRuntimeStatus: earthRuntimeStatus,
      earthProjection: earthProjection,
      earthStandard: earthStandard
    };
  }

  function bindInspectLinkReceipt() {
    var inspectLink = getInspectLink();

    if (!inspectLink) return;

    inspectLink.setAttribute("data-showroom-runtime-handoff", "inspect-universe");
    inspectLink.setAttribute("data-parent-route", "/showroom/");
    inspectLink.setAttribute("data-target-route", INSPECT_ROUTE);

    inspectLink.addEventListener("click", function () {
      document.documentElement.setAttribute("data-showroom-last-handoff", INSPECT_ROUTE);

      if (document.body) {
        document.body.setAttribute("data-showroom-last-handoff", INSPECT_ROUTE);
      }

      ensureAuditReceipt("showroom-last-handoff", INSPECT_ROUTE);
    });
  }

  function startObserver() {
    var mount = getMount();

    if (!mount) return;

    var observer = new MutationObserver(function () {
      measure();
    });

    observer.observe(mount, {
      attributes: true,
      attributeFilter: [
        "data-render-status",
        "data-earth-runtime-status",
        "data-earth-projection",
        "data-earth-camera-mode",
        "data-earth-lattice-scope",
        "data-earth-standard",
        "data-showroom-globe-placement"
      ],
      childList: true,
      subtree: true
    });

    window.setTimeout(measure, 250);
    window.setTimeout(measure, 900);
    window.setTimeout(measure, 1800);
    window.setTimeout(function () {
      measure();
      observer.disconnect();
    }, 9000);
  }

  function init() {
    markRuntimeBase();
    bindInspectLinkReceipt();
    measure();
    startObserver();

    window.DGBShowroomRuntime = Object.freeze({
      version: VERSION,
      role: "receipt-and-handoff-only",
      inspectRoute: INSPECT_ROUTE,
      renderController: RENDER_CONTROLLER,
      earthCanvas: EARTH_CANVAS,
      earthMaterial: EARTH_MATERIAL,
      earthSurface: EARTH_SURFACE,
      earthClouds: EARTH_CLOUDS,
      measure: measure
    });
  }

  ready(init);
})();
