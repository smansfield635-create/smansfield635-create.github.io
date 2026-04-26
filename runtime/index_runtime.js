// /runtime/index_runtime.js
/*
  Diamond Gate Bridge — Index Runtime
  File: /runtime/index_runtime.js
  Generation: 1
  Baseline: Root Door Solar Baseline 2
  Role: optional solar dazzle enhancement only.
*/

(function () {
  "use strict";

  var RUNTIME_NAME = "DGBIndexRuntime";
  var state = {
    started: false,
    pointerActive: false,
    glow: 0,
    turbulence: 0,
    corona: 0,
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

  function handlePointerMove(event) {
    var width = Math.max(window.innerWidth, 1);
    var height = Math.max(window.innerHeight, 1);

    var x = event.clientX / width - 0.5;
    var y = event.clientY / height - 0.5;

    state.pointerActive = true;

    setCssVar("--door-tilt-y", (clamp(x, -0.5, 0.5) * 17).toFixed(2) + "deg");
    setCssVar("--door-tilt-x", (-9 + clamp(y, -0.5, 0.5) * -11).toFixed(2) + "deg");
  }

  function handlePointerLeave() {
    state.pointerActive = false;
    setCssVar("--door-tilt-x", "-9deg");
    setCssVar("--door-tilt-y", "0deg");
  }

  function animateSolarVariables() {
    if (!state.started) return;

    var time = Date.now() / 1000;

    state.glow = 0.5 + Math.sin(time * 0.78) * 0.5;
    state.turbulence = 0.5 + Math.sin(time * 0.47 + 1.2) * 0.5;
    state.corona = 0.5 + Math.sin(time * 0.63 + 2.1) * 0.5;

    setCssVar("--runtime-glow", state.glow.toFixed(3));
    setCssVar("--solar-turbulence", state.turbulence.toFixed(3));
    setCssVar("--corona-intensity", state.corona.toFixed(3));
    setCssVar("--door-pulse", (1 + state.glow * 0.014).toFixed(4));

    state.frame = window.requestAnimationFrame(animateSolarVariables);
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
    var system = document.querySelector("[data-solar-system]");
    var links = document.querySelectorAll(".route-node");

    if (!system) return;

    links.forEach(function (link) {
      link.addEventListener("focus", function () {
        system.setAttribute("data-route-focus", link.textContent.trim());
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

    var door = document.querySelector("[data-sun-door]");
    if (!door) {
      setStatus("Static solar door active");
      return;
    }

    state.started = true;
    setStatus("Satellite solar runtime active");

    markRoutes();
    addRouteReceipts();

    if (!hasReducedMotion()) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
      animateSolarVariables();
    } else {
      setCssVar("--runtime-glow", "0.56");
      setCssVar("--solar-turbulence", "0.62");
      setCssVar("--corona-intensity", "0.58");
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
  }

  function getState() {
    return {
      name: RUNTIME_NAME,
      started: state.started,
      pointerActive: state.pointerActive,
      glow: state.glow,
      turbulence: state.turbulence,
      corona: state.corona
    };
  }

  function validate() {
    return {
      ok: Boolean(document.getElementById("door-root")) && Boolean(document.querySelector("[data-sun-door]")),
      runtime: RUNTIME_NAME,
      started: state.started,
      themePresent: document.body.textContent.includes("Learn to Live to Love"),
      doorPresent: Boolean(document.querySelector("[data-sun-door]")),
      noImageDependency: true
    };
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
