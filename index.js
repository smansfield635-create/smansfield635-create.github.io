(function () {
  "use strict";

  var VERSION = "universe-scale-field-b7";
  var SITE_RUNTIME_PATH = "/runtime/site_runtime.js?v=" + VERSION;
  var SUN_ASSET_RUNTIME_PATH = "/runtime/sun_asset_runtime.js?v=" + VERSION;
  var SITE_RUNTIME_NAME = "DGBSiteRuntime";
  var SUN_ASSET_RUNTIME_NAME = "DGBSunAssetRuntime";

  var BASELINE = "Generation 1 Universe Scale Field Baseline 1";
  var THEME = "Learn to Live to Love";

  var bootState = {
    pageVisible: false,
    siteRuntimeRequested: false,
    siteRuntimeLoaded: false,
    siteRuntimeFailed: false,
    sunAssetRuntimeRequested: false,
    sunAssetRuntimeLoaded: false,
    sunAssetRuntimeFailed: false,
    sunMounted: false,
    version: VERSION
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
        '<p style="margin:0 0 10px;color:rgba(255,217,138,.78);letter-spacing:.16em;text-transform:uppercase;font-size:12px;">Visible-first universe field fallback</p>' +
        '<h1 style="font-size:clamp(44px,12vw,88px);line-height:.88;letter-spacing:-.08em;margin:0;">Diamond Gate Bridge</h1>' +
        '<p style="font-size:clamp(24px,7vw,48px);line-height:.95;letter-spacing:-.06em;margin:18px 0 0;color:#fff8e7;">Learn to Live to Love</p>' +
        '<p style="max-width:620px;color:rgba(255,248,231,.72);line-height:1.55;margin:18px 0 0;">The universe field fallback is active. The page remains visible even if the sun runtime fails.</p>' +
        '<nav style="display:flex;flex-wrap:wrap;gap:10px;margin-top:24px;">' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/products/">Products</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/gauges/">Gauges</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/laws/">Laws</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/governance/">Governance</a>' +
        '</nav>' +
        '</main>';

      setStatus("Visible-first fallback active");
      return false;
    }

    bootState.pageVisible = true;

    if (window[SITE_RUNTIME_NAME] && typeof window[SITE_RUNTIME_NAME].registerVisibleFirst === "function") {
      window[SITE_RUNTIME_NAME].registerVisibleFirst({
        source: "index.js",
        root: root.id || "root",
        baseline: BASELINE,
        version: VERSION,
        object: "universe-scale-field"
      });
    }

    return true;
  }

  function getRuntimeVersion() {
    var runtime = window[SUN_ASSET_RUNTIME_NAME];

    if (!runtime || typeof runtime.getState !== "function") return "";

    try {
      return runtime.getState().version || "";
    } catch (error) {
      return "";
    }
  }

  function loadScript(path, onload, onerror) {
    var existing = Array.prototype.slice.call(document.querySelectorAll("script[src]")).find(function (script) {
      return script.getAttribute("src") === path;
    });

    if (existing) {
      if (typeof onload === "function") onload();
      return;
    }

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
        version: VERSION,
        theme: THEME,
        visibleFirst: bootState.pageVisible
      });
    }

    if (typeof window[SITE_RUNTIME_NAME].registerRuntime === "function") {
      window[SITE_RUNTIME_NAME].registerRuntime({
        id: "rootUniverseScaleFieldBoot",
        page: "home",
        role: "boot-handoff",
        path: "/index.js",
        version: VERSION,
        validated: true,
        optional: false
      });
    }
  }

  function loadSiteRuntimeThenSunRuntime() {
    if (bootState.siteRuntimeRequested || window[SITE_RUNTIME_NAME]) {
      registerSiteRuntime();
      loadSunAssetRuntime();
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
        loadSunAssetRuntime();
      },
      function () {
        bootState.siteRuntimeFailed = true;
        setStatus("Static universe field active");
        loadSunAssetRuntime();
      }
    );
  }

  function loadSunAssetRuntime() {
    var activeVersion = getRuntimeVersion();

    if (window[SUN_ASSET_RUNTIME_NAME] && activeVersion === VERSION) {
      mountSunAsset();
      return;
    }

    if (bootState.sunAssetRuntimeRequested) return;

    bootState.sunAssetRuntimeRequested = true;
    setStatus("Sun asset runtime loading · " + VERSION);

    loadScript(
      SUN_ASSET_RUNTIME_PATH,
      function () {
        bootState.sunAssetRuntimeLoaded = true;
        setStatus("Sun asset runtime active · " + VERSION);
        mountSunAsset();
      },
      function () {
        bootState.sunAssetRuntimeFailed = true;
        setStatus("Sun asset runtime failed");

        if (window[SITE_RUNTIME_NAME] && typeof window[SITE_RUNTIME_NAME].addWarning === "function") {
          window[SITE_RUNTIME_NAME].addWarning(
            "SUN_ASSET_RUNTIME_MISSING",
            "Root page could not load the Universe Scale Field runtime.",
            { path: SUN_ASSET_RUNTIME_PATH, baseline: BASELINE, version: VERSION }
          );
        }
      }
    );
  }

  function mountSunAsset() {
    var runtime = window[SUN_ASSET_RUNTIME_NAME];

    if (!runtime || typeof runtime.start !== "function") {
      setStatus("Sun asset runtime unavailable");
      return;
    }

    runtime.start({
      selector: "[data-dgb-sun-mount]",
      mode: "canvas",
      seed: 4217,
      intensity: 0.98,
      animate: true,
      frameRate: 10,
      version: VERSION
    }).then(function () {
      bootState.sunMounted = true;
      setStatus("Sun asset active · universe scale field b7");

      if (window[SITE_RUNTIME_NAME] && typeof window[SITE_RUNTIME_NAME].updateRuntimeStatus === "function") {
        window[SITE_RUNTIME_NAME].updateRuntimeStatus("sunAssetRuntime", {
          validated: true,
          loaded: true,
          mounted: true,
          baseline: BASELINE,
          version: VERSION
        });
      }
    }).catch(function (error) {
      bootState.sunAssetRuntimeFailed = true;
      setStatus("Sun asset mount failed");

      if (window[SITE_RUNTIME_NAME] && typeof window[SITE_RUNTIME_NAME].addWarning === "function") {
        window[SITE_RUNTIME_NAME].addWarning(
          "SUN_ASSET_MOUNT_FAILED",
          "Universe Scale Field runtime loaded but failed to mount.",
          {
            message: error && error.message ? error.message : "unknown",
            baseline: BASELINE,
            version: VERSION
          }
        );
      }
    });
  }

  function boot() {
    var visible = protectVisibleRoot();
    if (!visible) return;

    setStatus("Visible-first universe field active");
    loadSiteRuntimeThenSunRuntime();

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
        sunAssetRuntimeRequested: bootState.sunAssetRuntimeRequested,
        sunAssetRuntimeLoaded: bootState.sunAssetRuntimeLoaded,
        sunAssetRuntimeFailed: bootState.sunAssetRuntimeFailed,
        sunMounted: bootState.sunMounted,
        baseline: BASELINE,
        version: VERSION,
        sunAssetRuntimePath: SUN_ASSET_RUNTIME_PATH
      };
    },
    protectVisibleRoot: protectVisibleRoot,
    protectVisibleDoor: protectVisibleRoot
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
