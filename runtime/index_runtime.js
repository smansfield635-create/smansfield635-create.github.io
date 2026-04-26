/*
  Diamond Gate Bridge — Index Runtime
  File: /runtime/index_runtime.js
  Generation: 1
  Baseline: Root Door Solar Baseline 1
  Role: Optional solar dazzle enhancement only.
*/

(function () {
  "use strict";

  var RUNTIME_NAME = "DGBIndexRuntime";
  var state = {
    started: false,
    pointerActive: false,
    lastX: 0,
    lastY: 0,
    glow: 0,
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
    state.lastX = clamp(x, -0.5, 0.5);
    state.lastY = clamp(y, -0.5, 0.5);

    setCssVar("--door-tilt-y", (state.lastX * 18).toFixed(2) + "deg");
    setCssVar("--door-tilt-x", (-10 + state.lastY * -12).toFixed(2) + "deg");
  }

  function handlePointerLeave() {
    state.pointerActive = false;
    setCssVar("--door-tilt-x", "-10deg");
    setCssVar("--door-tilt-y", "0deg");
  }

  function animateGlow() {
    if (!state.started) return;

    var time = Date.now() / 1000;
    state.glow = 0.5 + Math.sin(time * 0.9) * 0.5;

    setCssVar("--runtime-glow", state.glow.toFixed(3));
    setCssVar("--door-pulse", (1 + state.glow * 0.018).toFixed(4));

    state.frame = window.requestAnimationFrame(animateGlow);
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

  function addRouteFocusReceipts() {
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
    setStatus("Solar runtime active");

    markRoutes();
    addRouteFocusReceipts();

    if (!hasReducedMotion()) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
      animateGlow();
    } else {
      setCssVar("--runtime-glow", "0.42");
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
      glow: state.glow
    };
  }

  function validate() {
    return {
      ok: Boolean(document.getElementById("door-root")) && Boolean(document.querySelector("[data-sun-door]")),
      runtime: RUNTIME_NAME,
      started: state.started,
      themePresent: document.body.textContent.includes("Learn to Live to Love"),
      doorPresent: Boolean(document.querySelector("[data-sun-door]"))
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
