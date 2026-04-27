/* TNT RENEWAL — /showroom/index.js
   SHOWROOM PAGE CONTROLLER · B27 · RUSSIAN DOLL CONTROLLER

   CONTRACT:
     - Controls Russian-doll showroom behavior only.
     - Does not load Earth renderer.
     - Does not load Earth runtime.
     - Does not touch Earth canvas projection.
     - Does not touch Earth controls.
     - Opens compact chambers from portal cards.
     - Maintains Earth consumer contract markers.
*/

(function () {
  "use strict";

  var VERSION = "showroom-index-b27-russian-doll-controller";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function markControllerReady() {
    document.documentElement.setAttribute("data-showroom-controller", VERSION);
  }

  function protectEarthConsumerContract() {
    var earthMount = document.querySelector("[data-dgb-earth-mount]");
    var earthCanvasScript = document.querySelector('script[src="/assets/earth/earth_canvas.js"]');
    var earthRuntimeScript = document.querySelector('script[src="/runtime/earth_asset_runtime.js"]');

    document.documentElement.setAttribute("data-showroom-earth-mount-present", earthMount ? "true" : "false");
    document.documentElement.setAttribute("data-showroom-earth-canvas-script-present", earthCanvasScript ? "true" : "false");
    document.documentElement.setAttribute("data-showroom-earth-runtime-script-present", earthRuntimeScript ? "true" : "false");
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

    if (!target) return;

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
  }

  function bindPortalOpeners() {
    var portals = Array.prototype.slice.call(document.querySelectorAll("[data-doll-open]"));

    portals.forEach(function (portal) {
      portal.addEventListener("click", function (event) {
        var targetId = portal.getAttribute("data-doll-open");

        if (!targetId) return;

        event.preventDefault();
        openDoll(targetId, true);

        if (history && history.replaceState) {
          history.replaceState(null, "", "#" + targetId);
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

    if (id && document.getElementById(id) && document.getElementById(id).classList.contains("doll")) {
      openDoll(id, false);
      return;
    }

    openDoll("doll-consider-energy", false);
  }

  ready(function () {
    markControllerReady();
    protectEarthConsumerContract();
    bindPortalOpeners();
    bindDollState();
    openFromHash();
  });
})();
