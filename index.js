/* G5 ROOT INDEX JS — COMPASS ROUTE ONLY
   FILE: /index.js
   VERSION: G5_COMPASS_ROUTE_ONLY_VIEW_CARRY_TNT_v1
   PURPOSE:
   - Keep Compass route-only.
   - Do not mount Flat/Round/Globe selector behavior on the root page.
   - Preserve Door as view-selector authority.
   - Carry ?view=flat|round|globe through internal links when already selected.
   - Avoid interfering with the satellite sun renderer.
   - Align Compass JS with G5 site-uniformity standard.
*/

(function () {
  "use strict";

  var VERSION = "G5_COMPASS_ROUTE_ONLY_VIEW_CARRY_TNT_v1";
  var PREVIOUS_VERSION = "root-index-route-only-b9";
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

    if (VALID[saved]) {
      return saved;
    }

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

    try {
      url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch (error) {
      return false;
    }
  }

  function shouldSkipViewCarryForRoute(pathname) {
    /*
      Door owns the actual view selector.
      Compass may carry the chosen view to Door, but it should not make root behave
      as if root owns the view selector.
    */
    return false;
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

    if (shouldSkipViewCarryForRoute(url.pathname)) return;

    url.searchParams.set("view", mode);

    if (url.origin === window.location.origin) {
      link.setAttribute("href", url.pathname + url.search + url.hash);
    } else {
      link.setAttribute("href", url.toString());
    }
  }

  function tagRoot(mode) {
    var root = document.querySelector("[data-root-door]") || document.documentElement;

    document.documentElement.setAttribute("data-view-mode", mode);
    document.documentElement.setAttribute("data-root-index-js", VERSION);
    document.documentElement.setAttribute("data-root-index-previous-js", PREVIOUS_VERSION);
    document.documentElement.setAttribute("data-compass-posture", "route-only");
    document.documentElement.setAttribute("data-view-selector-authority", "/door/");
    document.documentElement.setAttribute("data-active-view-carried", mode);
    document.documentElement.setAttribute("data-g5-site-uniformity", "active");
    document.documentElement.setAttribute("data-visual-pass-claim", "false");

    if (document.body) {
      document.body.setAttribute("data-view-mode", mode);
      document.body.setAttribute("data-compass-posture", "route-only");
      document.body.setAttribute("data-view-selector-authority", "/door/");
      document.body.setAttribute("data-active-view-carried", mode);
    }

    if (root) {
      root.setAttribute("data-root-index-js", VERSION);
      root.setAttribute("data-root-index-previous-js", PREVIOUS_VERSION);
      root.setAttribute("data-compass-posture", "route-only");
      root.setAttribute("data-view-selector-authority", "/door/");
      root.setAttribute("data-active-view-carried", mode);
      root.setAttribute("data-g5-site-uniformity", "active");
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
    var event;

    try {
      event = new CustomEvent("dgb:compass:ready", {
        detail: {
          version: VERSION,
          previousVersion: PREVIOUS_VERSION,
          mode: mode,
          posture: "route-only",
          viewSelectorAuthority: "/door/",
          g5SiteUniformity: true,
          publicEntrySurface: true,
          visualPassClaim: false,
          sunRendererTarget: "satellite observational solar disc",
          compassOwnsViewSelector: false
        }
      });

      window.dispatchEvent(event);
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
