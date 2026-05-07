/* /index.js
   COMPASS_ROUTE_ONLY_VIEW_CARRY_INTERPLANETARY_UNIFORMITY_TNT_v2
   Full-file replacement.
   Purpose:
   - Keep Compass route-only.
   - Carry ?view=flat|round|globe through internal links when already selected.
   - Preserve Door as view-selector authority.
   - Preserve interplanetary uniformity compatibility.
   - Do not mount Flat/Round/Globe selector behavior on the root page.
   - Do not render planets, canvases, or GraphicBox.
   - Do not claim visual pass.
*/

(function () {
  "use strict";

  var CONTRACT = "COMPASS_ROUTE_ONLY_VIEW_CARRY_INTERPLANETARY_UNIFORMITY_TNT_v2";
  var PREVIOUS_CONTRACT = "G5_COMPASS_ROUTE_ONLY_VIEW_CARRY_TNT_v1";
  var STORAGE_KEY = "dgb:viewMode";
  var VALID = { flat: true, round: true, globe: true };

  function safeGetStorage(key) {
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (error) {
      return null;
    }
  }

  function safeSetStorage(key, value) {
    try {
      if (window.localStorage) window.localStorage.setItem(key, value);
    } catch (error) {
      /* Storage can fail in privacy modes. Compass remains route-only. */
    }
  }

  function getCurrentView() {
    var params = new URLSearchParams(window.location.search);
    var incoming = params.get("view");
    var saved = safeGetStorage(STORAGE_KEY);

    if (VALID[incoming]) {
      safeSetStorage(STORAGE_KEY, incoming);
      return incoming;
    }

    if (VALID[saved]) return saved;
    return "flat";
  }

  function shouldCarryView(link) {
    var href = link.getAttribute("href") || "";
    var url;

    if (!href) return false;
    if (href.indexOf("#") === 0) return false;
    if (href.indexOf("mailto:") === 0) return false;
    if (href.indexOf("tel:") === 0) return false;
    if (href.indexOf("javascript:") === 0) return false;
    if (link.hasAttribute("download")) return false;
    if (link.dataset.noViewCarry === "true") return false;

    try {
      url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch (error) {
      return false;
    }
  }

  function setRouteHref(link, mode) {
    var rawHref = link.getAttribute("href") || "/";
    var url;

    if (!shouldCarryView(link)) return;

    try {
      url = new URL(rawHref, window.location.origin);
    } catch (error) {
      return;
    }

    url.searchParams.set("view", mode);
    link.setAttribute("href", url.pathname + url.search + url.hash);
  }

  function tagRoot(mode) {
    var root = document.querySelector("[data-root-door]") || document.documentElement;

    document.documentElement.setAttribute("data-view-mode", mode);
    document.documentElement.setAttribute("data-root-index-js", CONTRACT);
    document.documentElement.setAttribute("data-root-index-previous-js", PREVIOUS_CONTRACT);
    document.documentElement.setAttribute("data-compass-posture", "route-only");
    document.documentElement.setAttribute("data-view-selector-authority", "/door/");
    document.documentElement.setAttribute("data-active-view-carried", mode);
    document.documentElement.setAttribute("data-g5-site-uniformity", "active");
    document.documentElement.setAttribute("data-interplanetary-uniformity", "active");
    document.documentElement.setAttribute("data-generated-image", "false");
    document.documentElement.setAttribute("data-graphic-box", "false");
    document.documentElement.setAttribute("data-visual-pass-claim", "false");
    document.documentElement.setAttribute("data-visual-pass-claimed", "false");

    if (document.body) {
      document.body.setAttribute("data-view-mode", mode);
      document.body.setAttribute("data-compass-posture", "route-only");
      document.body.setAttribute("data-view-selector-authority", "/door/");
      document.body.setAttribute("data-active-view-carried", mode);
      document.body.setAttribute("data-generated-image", "false");
      document.body.setAttribute("data-graphic-box", "false");
      document.body.setAttribute("data-visual-pass-claimed", "false");
    }

    if (root) {
      root.setAttribute("data-root-index-js", CONTRACT);
      root.setAttribute("data-root-index-previous-js", PREVIOUS_CONTRACT);
      root.setAttribute("data-compass-posture", "route-only");
      root.setAttribute("data-view-selector-authority", "/door/");
      root.setAttribute("data-active-view-carried", mode);
      root.setAttribute("data-g5-site-uniformity", "active");
      root.setAttribute("data-interplanetary-uniformity", "active");
      root.setAttribute("data-public-entry-surface", "true");
    }
  }

  function carryViewThroughLinks(mode) {
    var links = Array.prototype.slice.call(document.querySelectorAll("a[href]"));
    links.forEach(function (link) {
      setRouteHref(link, mode);
    });
  }

  function publishReady(mode) {
    var detail = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      route: "/",
      mode: mode,
      posture: "route-only",
      viewSelectorAuthority: "/door/",
      interplanetaryUniformity: true,
      publicEntrySurface: true,
      owns: [
        "view_parameter_carry",
        "root_route_posture_receipt",
        "internal_link_view_continuity"
      ],
      doesNotOwn: [
        "view_selector_ui",
        "planet_rendering",
        "canvas_creation",
        "Gauges_logic",
        "GraphicBox",
        "image_generation",
        "visual_pass_claim"
      ],
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false,
      timestamp: new Date().toISOString()
    };

    window.DGB_COMPASS_ROUTE_ONLY_RECEIPT = detail;

    try {
      window.dispatchEvent(new CustomEvent("dgb:compass:ready", { detail: detail }));
    } catch (error) {
      /* Older browsers may not support CustomEvent construction. */
    }
  }

  function apply() {
    var mode = getCurrentView();
    tagRoot(mode);
    carryViewThroughLinks(mode);
    publishReady(mode);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }
})();
