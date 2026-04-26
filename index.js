
(function () {
  "use strict";

  var RUNTIME_NAME = "DGBIndexRuntime";
  var SITE_RUNTIME_NAME = "DGBSiteRuntime";
  var BASELINE = "Generation 1 Root Universe Sun Baseline 2";

  var state = {
    started: false,
    pointerActive: false,
    sunGlow: 0,
    coronaIntensity: 0,
    stellarDepth: 0,
    orbitBreath: 0,
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
        id: "universeSunRuntime",
        page: "home",
        role: "universe-sun-enhancement",
        path: "/runtime/index_runtime.js",
        validated: Boolean(validated),
        optional: true
      });
    }

    if (typeof site.registerPage === "function") {
      site.registerPage({
        id: "home",
        title: "Diamond Gate Bridge",
        baseline: BASELINE,
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

    setCssVar("--sun-tilt-y", (clamp(x, -0.5, 0.5) * 13).toFixed(2) + "deg");
    setCssVar("--sun-tilt-x", (-6 + clamp(y, -0.5, 0.5) * -9).toFixed(2) + "deg");
  }

  function handlePointerLeave() {
    state.pointerActive = false;
    setCssVar("--sun-tilt-x", "-6deg");
    setCssVar("--sun-tilt-y", "0deg");
  }

  function animateUniverseSun() {
    if (!state.started) return;

    var time = Date.now() / 1000;

    state.sunGlow = 0.5 + Math.sin(time * 0.72) * 0.5;
    state.coronaIntensity = 0.5 + Math.sin(time * 0.58 + 1.2) * 0.5;
    state.stellarDepth = 0.5 + Math.sin(time * 0.29 + 2.1) * 0.5;
    state.orbitBreath = 0.5 + Math.sin(time * 0.40 + 0.6) * 0.5;

    setCssVar("--sun-glow", state.sunGlow.toFixed(3));
    setCssVar("--corona-intensity", state.coronaIntensity.toFixed(3));
    setCssVar("--stellar-depth", state.stellarDepth.toFixed(3));
    setCssVar("--orbit-breath", state.orbitBreath.toFixed(3));
    setCssVar("--sun-pulse", (1 + state.sunGlow * 0.010).toFixed(4));

    state.frame = window.requestAnimationFrame(animateUniverseSun);
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
    var system = document.querySelector("[data-universe-system]");
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

  function protectVisibleRoot() {
    if (window.DGBIndexBoot && typeof window.DGBIndexBoot.protectVisibleRoot === "function") {
      window.DGBIndexBoot.protectVisibleRoot();
    } else if (window.DGBIndexBoot && typeof window.DGBIndexBoot.protectVisibleDoor === "function") {
      window.DGBIndexBoot.protectVisibleDoor();
    }
  }

  function start() {
    if (state.started) return;

    var sun = document.querySelector("[data-universe-sun-object]");
    if (!sun) {
      setStatus("Static universe sun active");
      registerWithSiteRuntime(false);
      return;
    }

    state.started = true;
    setStatus("Universe sun runtime active");

    markRoutes();
    addRouteReceipts();
    registerWithSiteRuntime(true);

    if (!hasReducedMotion()) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
      animateUniverseSun();
    } else {
      setCssVar("--sun-glow", "0.58");
      setCssVar("--corona-intensity", "0.56");
      setCssVar("--stellar-depth", "0.50");
      setCssVar("--orbit-breath", "0.50");
      setCssVar("--sun-pulse", "1");
    }

    window.setTimeout(protectVisibleRoot, 600);
    window.setTimeout(protectVisibleRoot, 1800);
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
      siteRuntime().updateRuntimeStatus("universeSunRuntime", {
        validated: false,
        stopped: true,
        baseline: BASELINE
      });
    }
  }

  function getState() {
    return {
      name: RUNTIME_NAME,
      started: state.started,
      pointerActive: state.pointerActive,
      sunGlow: state.sunGlow,
      coronaIntensity: state.coronaIntensity,
      stellarDepth: state.stellarDepth,
      orbitBreath: state.orbitBreath,
      baseline: BASELINE
    };
  }

  function validate() {
    var result = {
      ok: Boolean(document.getElementById("door-root")) && Boolean(document.querySelector("[data-universe-sun-object]")),
      runtime: RUNTIME_NAME,
      started: state.started,
      themePresent: document.body.textContent.includes("Learn to Live to Love"),
      sunPresent: Boolean(document.querySelector("[data-universe-sun-object]")),
      staleSolarDoorTextRemoved: !document.body.textContent.includes("Static Solar Door Active") && !document.body.textContent.includes("STATIC SOLAR DOOR ACTIVE"),
      sunLabelRemoved: !document.body.textContent.includes("SUN"),
      siteRuntimePresent: Boolean(siteRuntime()),
      noImageDependency: true,
      baseline: BASELINE
    };

    if (siteRuntime() && typeof siteRuntime().updateRuntimeStatus === "function") {
      siteRuntime().updateRuntimeStatus("universeSunRuntime", {
        validated: result.ok,
        lastValidation: result,
        baseline: BASELINE
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
