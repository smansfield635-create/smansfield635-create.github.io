/*
  Diamond Gate Bridge — Root Universe Sun Boot
  File: /index.js
  Generation: 1
  Baseline: Root Universe Sun Baseline 2
  Role: safe boot handoff, cross-board runtime loading, visible-first root protection.
*/

(function () {
  "use strict";

  var SITE_RUNTIME_PATH = "/runtime/site_runtime.js";
  var PAGE_RUNTIME_PATH = "/runtime/index_runtime.js";
  var SITE_RUNTIME_NAME = "DGBSiteRuntime";
  var PAGE_RUNTIME_NAME = "DGBIndexRuntime";

  var BASELINE = "Generation 1 Root Universe Sun Baseline 2";
  var THEME = "Learn to Live to Love";

  var bootState = {
    pageVisible: false,
    siteRuntimeRequested: false,
    siteRuntimeLoaded: false,
    siteRuntimeFailed: false,
    pageRuntimeRequested: false,
    pageRuntimeLoaded: false,
    pageRuntimeFailed: false
  };

  function getRoot() {
    return (
      document.getElementById("door-root") ||
      document.querySelector("[data-universe-sun]") ||
      document.querySelector("main")
    );
  }

  function setStatus(text) {
    var node = document.querySelector("[data-door-boot-status]");
    if (node) node.textContent = text;
  }

  function protectVisibleRoot() {
    var root = getRoot();

    if (!root || root.textContent.trim().length < 80) {
      document.body.innerHTML =
        '<main id="door-root" data-universe-sun style="min-height:100vh;padding:24px;background:#02040b;color:#fff8e7;font-family:system-ui,sans-serif;">' +
        '<p style="margin:0 0 10px;color:rgba(255,217,138,.78);letter-spacing:.16em;text-transform:uppercase;font-size:12px;">Visible-first universe sun fallback</p>' +
        '<h1 style="font-size:clamp(44px,12vw,88px);line-height:.88;letter-spacing:-.08em;margin:0;">Diamond Gate Bridge</h1>' +
        '<p style="font-size:clamp(24px,7vw,48px);line-height:.95;letter-spacing:-.06em;margin:18px 0 0;color:#fff8e7;">Learn to Live to Love</p>' +
        '<p style="max-width:620px;color:rgba(255,248,231,.72);line-height:1.55;margin:18px 0 0;">The universe sun fallback is active. The page remains visible even if runtime enhancement fails.</p>' +
        '<nav style="display:flex;flex-wrap:wrap;gap:10px;margin-top:24px;">' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/products/">Products</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/gauges/">Gauges</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/laws/">Laws</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/governance/">Governance</a>' +
        '</nav>' +
        '</main>';

      setStatus("Universe sun fallback active");
      return false;
    }

    bootState.pageVisible = true;

    if (window[SITE_RUNTIME_NAME] && typeof window[SITE_RUNTIME_NAME].registerVisibleFirst === "function") {
      window[SITE_RUNTIME_NAME].registerVisibleFirst({
        source: "index.js",
        root: root.id || "root",
        baseline: BASELINE,
        object: "universe-sun"
      });
    }

    return true;
  }

  function loadScript(path, onload, onerror) {
    var script = document.createElement("script");
    script.src = path;
    script.defer = true;
    script.onload = onload;
    script.onerror = onerror;
    document.body.appendChild(script);
  }

  function registerSiteRuntime() {
    if (!window[SITE_RUNTIME_NAME]) return;

    if (typeof window[SITE_RUNTIME_NAME].registerPage === "function") {
      window[SITE_RUNTIME_NAME].registerPage({
        id: "home",
        title: "Diamond Gate Bridge",
        baseline: BASELINE,
        theme: THEME,
        visibleFirst: bootState.pageVisible
      });
    }

    if (typeof window[SITE_RUNTIME_NAME].registerRuntime === "function") {
      window[SITE_RUNTIME_NAME].registerRuntime({
        id: "rootUniverseSunBoot",
        page: "home",
        role: "boot-handoff",
        path: "/index.js",
        validated: true,
        optional: false
      });
    }
  }

  function loadSiteRuntimeThenPageRuntime() {
    if (bootState.siteRuntimeRequested || window[SITE_RUNTIME_NAME]) {
      registerSiteRuntime();
      loadPageRuntime();
      return;
    }

    bootState.siteRuntimeRequested = true;
    setStatus("Site runtime loading");

    loadScript(
      SITE_RUNTIME_PATH,
      function () {
        bootState.siteRuntimeLoaded = true;
        setStatus("Site runtime active");
        registerSiteRuntime();
        loadPageRuntime();
      },
      function () {
        bootState.siteRuntimeFailed = true;
        setStatus("Static universe sun active");
        loadPageRuntime();
      }
    );
  }

  function loadPageRuntime() {
    if (bootState.pageRuntimeRequested || window[PAGE_RUNTIME_NAME]) return;

    bootState.pageRuntimeRequested = true;
    setStatus("Universe sun runtime loading");

    loadScript(
      PAGE_RUNTIME_PATH,
      function () {
        bootState.pageRuntimeLoaded = true;
        setStatus("Universe sun runtime active");

        if (window[PAGE_RUNTIME_NAME] && typeof window[PAGE_RUNTIME_NAME].start === "function") {
          window[PAGE_RUNTIME_NAME].start();
        }

        if (window[SITE_RUNTIME_NAME] && typeof window[SITE_RUNTIME_NAME].updateRuntimeStatus === "function") {
          window[SITE_RUNTIME_NAME].updateRuntimeStatus("universeSunRuntime", {
            validated: true,
            loaded: true,
            baseline: BASELINE
          });
        }
      },
      function () {
        bootState.pageRuntimeFailed = true;
        setStatus("Static universe sun active");

        if (window[SITE_RUNTIME_NAME] && typeof window[SITE_RUNTIME_NAME].addWarning === "function") {
          window[SITE_RUNTIME_NAME].addWarning(
            "PAGE_RUNTIME_MISSING",
            "Root universe sun page runtime did not load.",
            { path: PAGE_RUNTIME_PATH, baseline: BASELINE }
          );
        }
      }
    );
  }

  function boot() {
    var visible = protectVisibleRoot();
    if (!visible) return;

    setStatus("Visible-first universe sun active");
    loadSiteRuntimeThenPageRuntime();

    window.setTimeout(protectVisibleRoot, 500);
    window.setTimeout(protectVisibleRoot, 1600);
  }

  window.DGBIndexBoot = Object.freeze({
    getState: function () {
      return {
        pageVisible: bootState.pageVisible,
        siteRuntimeRequested: bootState.siteRuntimeRequested,
        siteRuntimeLoaded: bootState.siteRuntimeLoaded,
        siteRuntimeFailed: bootState.siteRuntimeFailed,
        pageRuntimeRequested: bootState.pageRuntimeRequested,
        pageRuntimeLoaded: bootState.pageRuntimeLoaded,
        pageRuntimeFailed: bootState.pageRuntimeFailed,
        baseline: BASELINE
      };
    },

    protectVisibleRoot: protectVisibleRoot,

    /*
      Compatibility alias:
      Existing page runtimes may still call protectVisibleDoor().
      The function now protects the universe-sun root surface.
    */
    protectVisibleDoor: protectVisibleRoot
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
