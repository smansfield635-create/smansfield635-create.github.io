/* ROOT INDEX JS — COMPASS ROUTE ONLY B9
   FILE: /index.js
   PURPOSE:
   - Keep Compass route-only.
   - Do not mount Flat/Round/Globe selector behavior on the root page.
   - Preserve Door as view-selector authority.
   - Carry ?view=flat|round|globe through links when already selected.
   - Avoid interfering with the satellite sun renderer.
*/

(function () {
  "use strict";

  var VERSION = "root-index-route-only-b9";
  var STORAGE_KEY = "dgb:viewMode";
  var VALID = { flat: true, round: true, globe: true };

  function getCurrentView() {
    var params = new URLSearchParams(window.location.search);
    var incoming = params.get("view");
    var saved = localStorage.getItem(STORAGE_KEY);

    if (VALID[incoming]) {
      localStorage.setItem(STORAGE_KEY, incoming);
      return incoming;
    }

    if (VALID[saved]) {
      return saved;
    }

    return "flat";
  }

  function shouldCarryView(link) {
    var href = link.getAttribute("href") || "";

    if (!href) return false;
    if (href.indexOf("#") === 0) return false;
    if (href.indexOf("mailto:") === 0) return false;
    if (href.indexOf("tel:") === 0) return false;
    if (href.indexOf("http://") === 0 || href.indexOf("https://") === 0) {
      try {
        return new URL(href).origin === window.location.origin;
      } catch (error) {
        return false;
      }
    }

    return true;
  }

  function setRouteHref(link, mode) {
    var base = link.getAttribute("href") || "/";
    var hash = "";
    var hashIndex;
    var queryIndex;
    var path;
    var query;
    var routeParams;

    if (!shouldCarryView(link)) return;

    hashIndex = base.indexOf("#");

    if (hashIndex >= 0) {
      hash = base.slice(hashIndex);
      base = base.slice(0, hashIndex);
    }

    queryIndex = base.indexOf("?");
    path = queryIndex >= 0 ? base.slice(0, queryIndex) : base;
    query = queryIndex >= 0 ? base.slice(queryIndex + 1) : "";
    routeParams = new URLSearchParams(query);

    routeParams.set("view", mode);
    link.setAttribute("href", path + "?" + routeParams.toString() + hash);
  }

  function apply() {
    var mode = getCurrentView();
    var links = Array.prototype.slice.call(document.querySelectorAll("a[href]"));
    var root = document.querySelector("[data-root-door]") || document.documentElement;

    document.documentElement.setAttribute("data-view-mode", mode);
    document.body.setAttribute("data-view-mode", mode);

    if (root) {
      root.setAttribute("data-root-index-js", VERSION);
      root.setAttribute("data-compass-posture", "route-only");
      root.setAttribute("data-view-selector-authority", "/door/");
      root.setAttribute("data-active-view-carried", mode);
    }

    links.forEach(function (link) {
      setRouteHref(link, mode);
    });

    window.dispatchEvent(new CustomEvent("dgb:compass:ready", {
      detail: {
        version: VERSION,
        mode: mode,
        posture: "route-only",
        viewSelectorAuthority: "/door/",
        sunRendererTarget: "satellite observational solar disc"
      }
    }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }
})();
