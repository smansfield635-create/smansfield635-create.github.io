/* TNT CREATE — /showroom/index.js
   SHOWROOM PAGE CONTROLLER · B25

   CONTRACT:
     - Controls TED Talk showroom behavior only.
     - Does not load Earth renderer.
     - Does not load Earth runtime.
     - Does not touch Earth canvas projection.
     - Does not touch Earth controls.
     - Handles portal navigation, locked Energy behavior, and section state.
*/

(function () {
  "use strict";

  var VERSION = "showroom-index-b25-platform-controller";

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

  function bindLockedLinks() {
    var lockedLinks = Array.prototype.slice.call(document.querySelectorAll("[data-locked-link]"));

    lockedLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();

        document.documentElement.setAttribute("data-showroom-locked-selection", link.getAttribute("data-locked-link") || "locked");

        var energy = document.getElementById("energy");
        if (energy && typeof energy.scrollIntoView === "function") {
          energy.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });
  }

  function bindPortalState() {
    var portals = Array.prototype.slice.call(document.querySelectorAll(".portal[href^='#']"));
    var sections = portals
      .map(function (portal) {
        var id = portal.getAttribute("href").slice(1);
        var section = document.getElementById(id);

        return {
          portal: portal,
          id: id,
          section: section
        };
      })
      .filter(function (item) {
        return item.section;
      });

    function setActive(id) {
      sections.forEach(function (item) {
        if (item.id === id) {
          item.portal.setAttribute("data-active", "true");
        } else {
          item.portal.removeAttribute("data-active");
        }
      });

      document.documentElement.setAttribute("data-showroom-section", id);
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      }, {
        root: null,
        threshold: 0.42
      });

      sections.forEach(function (item) {
        observer.observe(item.section);
      });
    }

    sections.forEach(function (item) {
      item.portal.addEventListener("click", function () {
        setActive(item.id);
      });
    });
  }

  function protectEarthConsumerContract() {
    var earthMount = document.querySelector("[data-dgb-earth-mount]");
    var earthCanvasScript = document.querySelector('script[src="/assets/earth/earth_canvas.js"]');
    var earthRuntimeScript = document.querySelector('script[src="/runtime/earth_asset_runtime.js"]');

    document.documentElement.setAttribute("data-showroom-earth-mount-present", earthMount ? "true" : "false");
    document.documentElement.setAttribute("data-showroom-earth-canvas-script-present", earthCanvasScript ? "true" : "false");
    document.documentElement.setAttribute("data-showroom-earth-runtime-script-present", earthRuntimeScript ? "true" : "false");
  }

  ready(function () {
    markControllerReady();
    bindLockedLinks();
    bindPortalState();
    protectEarthConsumerContract();
  });
})();
