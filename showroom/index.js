/* TNT RENEWAL — /showroom/index.js
   SHOWROOM PAGE CONTROLLER · B28 · RUSSIAN DOLL CONTROLLER

   CONTRACT:
     - Controls Russian-doll showroom behavior only.
     - Does not load Earth renderer.
     - Does not load Earth runtime.
     - Does not touch Earth canvas projection.
     - Does not touch Earth controls.
     - Does not initialize DGBEarthCanvas.
     - Opens compact chambers from portal cards.
     - Observes Earth consumer contract markers without owning them.
     - Supports cache-busted script/link URLs.
*/

(function () {
  "use strict";

  var VERSION = "showroom-index-b28-russian-doll-controller";
  var DEFAULT_DOLL_ID = "doll-consider-energy";
  var OBSERVER_TIMEOUT_MS = 9000;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function markControllerReady() {
    document.documentElement.setAttribute("data-showroom-controller", VERSION);
    document.documentElement.setAttribute("data-showroom-controller-role", "russian-doll-only");
    document.documentElement.setAttribute("data-showroom-earth-ownership", "consumer-observer-only");
  }

  function getPathFromUrl(value) {
    if (!value) return "";

    try {
      return new URL(value, window.location.origin).pathname;
    } catch (error) {
      return String(value).split("?")[0].split("#")[0];
    }
  }

  function findScriptByPath(pathname) {
    var scripts = Array.prototype.slice.call(document.scripts || []);

    return scripts.find(function (script) {
      return getPathFromUrl(script.getAttribute("src")) === pathname;
    }) || null;
  }

  function findStylesheetByPath(pathname) {
    var links = Array.prototype.slice.call(document.querySelectorAll('link[rel~="stylesheet"]'));

    return links.find(function (link) {
      return getPathFromUrl(link.getAttribute("href")) === pathname;
    }) || null;
  }

  function boolString(value) {
    return value ? "true" : "false";
  }

  function protectEarthConsumerContract() {
    var earthMount = document.querySelector("[data-dgb-earth-mount]");
    var earthCanvas = document.querySelector("[data-dgb-earth-canvas]");
    var showroomMount = document.getElementById("showroom-globe-mount");

    var earthCanvasScript = findScriptByPath("/assets/earth/earth_canvas.js");
    var showroomGlobeScript = findScriptByPath("/showroom/globe/index.js");
    var earthMaterialLink = findStylesheetByPath("/assets/earth/earth_material.css");

    var earthRuntimeScript = findScriptByPath("/runtime/earth_asset_runtime.js");

    document.documentElement.setAttribute("data-showroom-earth-mount-present", boolString(earthMount));
    document.documentElement.setAttribute("data-showroom-earth-canvas-node-present", boolString(earthCanvas));
    document.documentElement.setAttribute("data-showroom-globe-mount-present", boolString(showroomMount));
    document.documentElement.setAttribute("data-showroom-earth-canvas-script-present", boolString(earthCanvasScript));
    document.documentElement.setAttribute("data-showroom-globe-controller-script-present", boolString(showroomGlobeScript));
    document.documentElement.setAttribute("data-showroom-earth-material-link-present", boolString(earthMaterialLink));
    document.documentElement.setAttribute("data-showroom-earth-runtime-script-present", boolString(earthRuntimeScript));

    if (showroomMount) {
      document.documentElement.setAttribute(
        "data-showroom-globe-render-status",
        showroomMount.getAttribute("data-render-status") || "unreported"
      );

      document.documentElement.setAttribute(
        "data-showroom-globe-earth-standard",
        showroomMount.getAttribute("data-earth-standard") || "unreported"
      );
    }

    if (earthMount && earthCanvas && earthCanvasScript && showroomGlobeScript && earthMaterialLink) {
      document.documentElement.setAttribute("data-showroom-earth-consumer-contract", "ready");
    } else if (earthCanvasScript && showroomGlobeScript && earthMaterialLink) {
      document.documentElement.setAttribute("data-showroom-earth-consumer-contract", "waiting-for-mount");
    } else {
      document.documentElement.setAttribute("data-showroom-earth-consumer-contract", "incomplete");
    }
  }

  function observeEarthConsumerContract() {
    var stopAt = Date.now() + OBSERVER_TIMEOUT_MS;

    protectEarthConsumerContract();

    var observer = new MutationObserver(function () {
      protectEarthConsumerContract();

      if (Date.now() > stopAt) {
        observer.disconnect();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "data-render-status",
        "data-earth-standard",
        "data-earth-canvas-spine",
        "data-earth-surface",
        "data-earth-clouds"
      ]
    });

    window.setTimeout(protectEarthConsumerContract, 250);
    window.setTimeout(protectEarthConsumerContract, 900);
    window.setTimeout(protectEarthConsumerContract, 1800);
    window.setTimeout(function () {
      protectEarthConsumerContract();
      observer.disconnect();
    }, OBSERVER_TIMEOUT_MS);
  }

  function setActivePortal(targetId) {
    var portals = Array.prototype.slice.call(document.querySelectorAll("[data-doll-open]"));

    portals.forEach(function (portal) {
      if (portal.getAttribute("data-doll-open") === targetId) {
        portal.setAttribute("data-active", "true");
      } else {
        portal.removeAttribute("data-active");
      }
    });

    document.documentElement.setAttribute("data-showroom-doll", targetId || "");
  }

  function openDoll(targetId, scroll) {
    var target = document.getElementById(targetId);
    var allDolls = Array.prototype.slice.call(document.querySelectorAll(".doll"));

    if (!target || !target.classList.contains("doll")) return false;

    allDolls.forEach(function (doll) {
      if (doll === target) {
        doll.setAttribute("open", "");
      } else {
        doll.removeAttribute("open");
      }
    });

    setActivePortal(targetId);

    if (scroll && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    return true;
  }

  function bindPortalOpeners() {
    var portals = Array.prototype.slice.call(document.querySelectorAll("[data-doll-open]"));

    portals.forEach(function (portal) {
      portal.addEventListener("click", function (event) {
        var targetId = portal.getAttribute("data-doll-open");

        if (!targetId) return;

        event.preventDefault();

        if (openDoll(targetId, true) && window.history && window.history.replaceState) {
          window.history.replaceState(null, "", "#" + targetId);
        }
      });
    });
  }

  function bindDollState() {
    var dolls = Array.prototype.slice.call(document.querySelectorAll(".doll"));

    dolls.forEach(function (doll) {
      doll.addEventListener("toggle", function () {
        if (!doll.open) return;

        dolls.forEach(function (other) {
          if (other !== doll) other.removeAttribute("open");
        });

        setActivePortal(doll.id);
      });
    });
  }

  function openFromHash() {
    var id = (window.location.hash || "").replace("#", "");

    if (id && openDoll(id, false)) return;

    if (document.getElementById(DEFAULT_DOLL_ID)) {
      openDoll(DEFAULT_DOLL_ID, false);
      return;
    }

    var firstDoll = document.querySelector(".doll");

    if (firstDoll && firstDoll.id) {
      openDoll(firstDoll.id, false);
    }
  }

  ready(function () {
    markControllerReady();
    observeEarthConsumerContract();
    bindPortalOpeners();
    bindDollState();
    openFromHash();
  });
})();
