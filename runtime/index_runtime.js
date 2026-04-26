/*
  Diamond Gate Bridge — Index Runtime
  File: /runtime/index_runtime.js
  Generation: 1
  Baseline: Root Door Seasonal Solar Baseline 1
  Role: optional seasonal door enhancement only; registers with cross-board site runtime.
*/

(function () {
  "use strict";

  var RUNTIME_NAME = "DGBIndexRuntime";
  var SITE_RUNTIME_NAME = "DGBSiteRuntime";

  var state = {
    started: false,
    pointerActive: false,
    glow: 0,
    seasonShift: 0,
    sunBlessing: 0,
    frame: null
  };

  function root() {
    return document.documentElement;
  }

  function setCssVar(name, value) {
    root().style.setProperty(name, value);
  }

  function setStatus(text) {
    var node = document.querySelector("[data-door-boot-status]");
    if (node) node.textContent = text;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function hasReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function siteRuntime() {
    return window[SITE_RUNTIME_NAME] || null;
  }

  function registerWithSiteRuntime(validated) {
    var site = siteRuntime();

    if (!site) return;

    if (typeof site.registerRuntime === "function") {
      site.registerRuntime({
        id: "seasonalDoorRuntime",
        page: "home",
        role: "seasonal-door-enhancement",
        path: "/runtime/index_runtime.js",
        validated: Boolean(validated),
        optional: true
      });
    }

    if (typeof site.registerPage === "function") {
      site.registerPage({
        id: "home",
        title: "Diamond Gate Bridge",
        baseline: "Generation 1 Root Door Seasonal Solar Baseline 1",
        theme: "Learn to Live to Love",
        visibleFirst: Boolean(document.getElementById("door-root"))
      });
    }
  }

  function handlePointerMove(event) {
    var width = Math.max(window.innerWidth, 1);
    var height = Math.max(window.innerHeight, 1);

    var x = event.clientX / width - 0.5;
    var y = event.clientY / height - 0.5;

    state.pointerActive = true;

    setCssVar("--door-tilt-y", (clamp(x, -0.5, 0.5) * 12).toFixed(2) + "deg");
    setCssVar("--door-tilt-x", (-5 + clamp(y, -0.5, 0.5) * -8).toFixed(2) + "deg");
  }

  function handlePointerLeave() {
    state.pointerActive = false;
    setCssVar("--door-tilt-x", "-5deg");
    setCssVar("--door-tilt-y", "0deg");
  }

  function animateDoorVariables() {
    if (!state.started) return;

    var time = Date.now() / 1000;

    state.glow = 0.5 + Math.sin(time * 0.68) * 0.5;
    state.seasonShift = 0.5 + Math.sin(time * 0.31 + 1.4) * 0.5;
    state.sunBlessing = 0.5 + Math.sin(time * 0.54 + 2.2) * 0.5;

    setCssVar("--door-glow", state.glow.toFixed(3));
    setCssVar("--season-shift", state.seasonShift.toFixed(3));
    setCssVar("--sun-blessing", state.sunBlessing.toFixed(3));
    setCssVar("--door-pulse", (1 + state.glow * 0.006).toFixed(4));

    state.frame = window.requestAnimationFrame(animateDoorVariables);
  }

  function markRoutes() {
    var current = window.location.pathname;
    var links = document.querySelectorAll(".route-node, .action");

    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href && href === current) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function addRouteReceipts() {
    var system = document.querySelector("[data-door-system]");
    var links = document.querySelectorAll(".route-node");

    if (!system) return;

    links.forEach(function (link) {
      link.addEventListener("focus", function () {
        system.setAttribute("data-route-focus", link.textContent.trim());

        if (siteRuntime() && typeof siteRuntime().addReceipt === "function") {
          siteRuntime().addReceipt("ROUTE_FOCUS", {
            route: link.getAttribute("href"),
            label: link.textContent.trim()
          });
        }
      });

      link.addEventListener("blur", function () {
        system.removeAttribute("data-route-focus");
      });

      link.addEventListener("mouseenter", function () {
        system.setAttribute("data-route-focus", link.textContent.trim());
      });

      link.addEventListener("mouseleave", function () {
        system.removeAttribute("data-route-focus");
      });
    });
  }

  function protectVisibleDoor() {
    if (window.DGBIndexBoot && typeof window.DGBIndexBoot.protectVisibleDoor === "function") {
      window.DGBIndexBoot.protectVisibleDoor();
    }
  }

  function start() {
    if (state.started) return;

    var door = document.querySelector("[data-seasonal-door]");
    if (!door) {
      setStatus("Static seasonal door active");
      registerWithSiteRuntime(false);
      return;
    }

    state.started = true;
    setStatus("Seasonal door runtime active");

    markRoutes();
    addRouteReceipts();
    registerWithSiteRuntime(true);

    if (!hasReducedMotion()) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
      animateDoorVariables();
    } else {
      setCssVar("--door-glow", "0.55");
      setCssVar("--season-shift", "0.55");
      setCssVar("--sun-blessing", "0.55");
      setCssVar("--door-pulse", "1");
    }

    window.setTimeout(protectVisibleDoor, 600);
    window.setTimeout(protectVisibleDoor, 1800);
  }

  function stop() {
    state.started = false;

    if (state.frame) {
      window.cancelAnimationFrame(state.frame);
      state.frame = null;
    }

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerleave", handlePointerLeave);

    if (siteRuntime() && typeof siteRuntime().updateRuntimeStatus === "function") {
      siteRuntime().updateRuntimeStatus("seasonalDoorRuntime", {
        validated: false,
        stopped: true
      });
    }
  }

  function getState() {
    return {
      name: RUNTIME_NAME,
      started: state.started,
      pointerActive: state.pointerActive,
      glow: state.glow,
      seasonShift: state.seasonShift,
      sunBlessing: state.sunBlessing
    };
  }

  function validate() {
    var result = {
      ok: Boolean(document.getElementById("door-root")) && Boolean(document.querySelector("[data-seasonal-door]")),
      runtime: RUNTIME_NAME,
      started: state.started,
      themePresent: document.body.textContent.includes("Learn to Live to Love"),
      doorPresent: Boolean(document.querySelector("[data-seasonal-door]")),
      siteRuntimePresent: Boolean(siteRuntime()),
      noImageDependency: true
    };

    if (siteRuntime() && typeof siteRuntime().updateRuntimeStatus === "function") {
      siteRuntime().updateRuntimeStatus("seasonalDoorRuntime", {
        validated: result.ok,
        lastValidation: result
      });
    }

    return result;
  }

  window[RUNTIME_NAME] = Object.freeze({
    start: start,
    stop: stop,
    getState: getState,
    validate: validate
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
