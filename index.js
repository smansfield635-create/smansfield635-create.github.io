(function () {
  "use strict";

  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var VERSION = ROOT_BOOT_ID;
  var SITE_RUNTIME_PATH = "/runtime/site_runtime.js?v=" + VERSION;
  var SUN_ASSET_RUNTIME_PATH = "/runtime/sun_asset_runtime.js?v=" + VERSION;
  var SITE_RUNTIME_NAME = "DGBSiteRuntime";
  var SUN_ASSET_RUNTIME_NAME = "DGBSunAssetRuntime";
  var CANOPY_NAME = "DGBSpineCanopy";

  var BASELINE = "Generation 1 · Baseline 6";
  var THEME = "Learn to Live to Love";
  var ROOT_CONTRACT = "universe-sun";
  var SUN_ASSET_MOUNT = "sun asset mount";

  var bootState = {
    pageVisible: false,
    siteRuntimeRequested: false,
    siteRuntimeLoaded: false,
    siteRuntimeFailed: false,
    sunAssetRuntimeRequested: false,
    sunAssetRuntimeLoaded: false,
    sunAssetRuntimeFailed: false,
    sunMounted: false,
    fallbackSunVisible: false,
    compassHeld: true,
    version: VERSION,
    rootBootId: ROOT_BOOT_ID
  };

  var ROOT_CONTRACT_MARKERS = Object.freeze({
    ROOT_BOOT_ID: ROOT_BOOT_ID,
    ROOT_BASELINE: BASELINE,
    ROOT_CONTRACT: ROOT_CONTRACT,
    SUN_ASSET_RUNTIME: "/runtime/sun_asset_runtime.js",
    SUN_ASSET_MOUNT: SUN_ASSET_MOUNT,
    STALE_SOLAR_DOOR_LANGUAGE: "removed",
    TREE_PHYSICAL_DOOR_STRETCH: "removed",
    ROUTE_CONTROL_OBJECT: "held-by-canopy"
  });

  function canopy() {
    return window[CANOPY_NAME] || null;
  }

  function canopySource(name, payload) {
    if (canopy() && typeof canopy().registerSource === "function") {
      canopy().registerSource(name, payload || {});
    }
  }

  function canopyVisual(name, payload) {
    if (canopy() && typeof canopy().registerVisual === "function") {
      canopy().registerVisual(name, payload || {});
    }
  }

  function canopyReceipt(type, payload) {
    if (canopy() && typeof canopy().addReceipt === "function") {
      canopy().addReceipt(type, payload || {});
    }
  }

  function canopyWarning(code, message, payload) {
    if (canopy() && typeof canopy().addWarning === "function") {
      canopy().addWarning(code, message, payload || {});
    }
  }

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

  function ensureFallbackSun() {
    var mount = document.querySelector("[data-dgb-sun-mount]");
    var fallback;

    if (!mount) return false;

    fallback = mount.querySelector("[data-sun-fallback]");

    if (!fallback) {
      fallback = document.createElement("div");
      fallback.className = "sun-fallback";
      fallback.setAttribute("data-sun-fallback", "");
      fallback.setAttribute("aria-hidden", "true");
      mount.appendChild(fallback);
    }

    bootState.fallbackSunVisible = true;

    canopyVisual("fallbackSun", {
      owner: "/index.html",
      present: true,
      purpose: "visible-first sun protection"
    });

    return true;
  }

  function markSunRuntimeMounted() {
    var mount = document.querySelector("[data-dgb-sun-mount]");
    if (mount) {
      mount.setAttribute("data-runtime-mounted", "true");
    }
  }

  function protectVisibleRoot() {
    var root = getRoot();

    if (!root || root.textContent.trim().length < 80) {
      document.body.innerHTML =
        '<main id="door-root" data-universe-sun data-root-boot-id="' + ROOT_BOOT_ID + '" data-root-contract="' + ROOT_CONTRACT + '" style="min-height:100vh;padding:24px;background:#02040b;color:#fff8e7;font-family:system-ui,sans-serif;">' +
        '<p style="margin:0 0 10px;color:rgba(255,217,138,.78);letter-spacing:.16em;text-transform:uppercase;font-size:12px;">Visible-first universe field fallback</p>' +
        '<h1 style="font-size:clamp(44px,12vw,88px);line-height:.88;letter-spacing:-.08em;margin:0;">Diamond Gate Bridge</h1>' +
        '<p style="font-size:clamp(24px,7vw,48px);line-height:.95;letter-spacing:-.06em;margin:18px 0 0;color:#fff8e7;">' + THEME + '</p>' +
        '<p style="max-width:620px;color:rgba(255,248,231,.72);line-height:1.55;margin:18px 0 0;">The universe field fallback is active. The page remains visible even if the sun asset runtime fails.</p>' +
        '<div data-dgb-sun-mount data-sun-mode="fallback" style="position:relative;width:min(72vw,420px);aspect-ratio:1;margin:28px auto;border-radius:999px;background:radial-gradient(circle at 39% 38%,rgba(255,255,226,.96),rgba(255,226,116,.84) 13%,transparent 25%),radial-gradient(circle at 52% 52%,rgba(255,182,61,.98),rgba(226,78,24,.88) 48%,rgba(92,23,12,.94) 77%,rgba(8,4,6,.96) 100%);box-shadow:inset -38px -34px 52px rgba(0,0,0,.54),inset 18px 16px 38px rgba(255,234,148,.34),0 0 46px rgba(255,142,48,.26),0 0 130px rgba(255,196,88,.18);"></div>' +
        '<nav style="display:flex;flex-wrap:wrap;gap:10px;margin-top:24px;">' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/products/">Products</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/gauges/">Gauges</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/laws/">Laws</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/governance/">Governance</a>' +
        '</nav>' +
        '<p data-door-boot-status style="margin-top:18px;color:rgba(255,248,231,.58);font-size:12px;letter-spacing:.12em;text-transform:uppercase;">Visible-first fallback active</p>' +
        '</main>';

      setStatus("Visible-first fallback active");
      ensureFallbackSun();
      canopyWarning("ROOT_FALLBACK_REBUILT", "Root fallback rebuilt because visible root was missing or too short.", {
        rootBootId: ROOT_BOOT_ID
      });
      return false;
    }

    root.setAttribute("data-root-boot-id", ROOT_BOOT_ID);
    root.setAttribute("data-root-baseline", BASELINE);
    root.setAttribute("data-root-contract", ROOT_CONTRACT);
    root.setAttribute("data-sun-asset-mount-contract", SUN_ASSET_MOUNT);
    root.setAttribute("data-route-control-object", "held-by-canopy");

    bootState.pageVisible = true;
    ensureFallbackSun();

    canopySource("indexBoot", {
      source: "/index.js",
      baseline: BASELINE,
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      contract: ROOT_CONTRACT
    });

    canopyVisual("root", {
      present: true,
      visibleFirst: true,
      theme: THEME,
      contract: ROOT_CONTRACT
    });

    canopyVisual("background", {
      owner: "/index.html",
      present: Boolean(document.querySelector(".universe-sky")),
      rule: "background may not mutate sun"
    });

    canopyVisual("compass", {
      held: true,
      reason: "held until canopy confirms root visual stability"
    });

    if (window[SITE_RUNTIME_NAME] && typeof window[SITE_RUNTIME_NAME].registerVisibleFirst === "function") {
      window[SITE_RUNTIME_NAME].registerVisibleFirst({
        source: "index.js",
        root: root.id || "root",
        baseline: BASELINE,
        version: VERSION,
        rootBootId: ROOT_BOOT_ID,
        object: ROOT_CONTRACT,
        sunAssetMount: SUN_ASSET_MOUNT
      });
    }

    return true;
  }

  function loadScript(path, onload, onerror) {
    var base = path.split("?")[0];
    var existing = Array.prototype.slice.call(document.querySelectorAll("script[src]")).find(function (script) {
      var src = script.getAttribute("src") || "";
      return src === path || src.split("?")[0] === base;
    });

    if (existing && existing.getAttribute("data-dgb-loaded") === "true") {
      if (typeof onload === "function") onload();
      return;
    }

    if (existing && !existing.getAttribute("data-dgb-loaded")) {
      existing.addEventListener("load", function () {
        existing.setAttribute("data-dgb-loaded", "true");
        if (typeof onload === "function") onload();
      }, { once: true });

      existing.addEventListener("error", function () {
        if (typeof onerror === "function") onerror();
      }, { once: true });

      return;
    }

    var script = document.createElement("script");
    script.src = path;
    script.defer = true;
    script.onload = function () {
      script.setAttribute("data-dgb-loaded", "true");
      if (typeof onload === "function") onload();
    };
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
        rootBootId: ROOT_BOOT_ID,
        theme: THEME,
        contract: ROOT_CONTRACT,
        sunAssetMount: SUN_ASSET_MOUNT,
        visibleFirst: bootState.pageVisible
      });
    }

    if (typeof window[SITE_RUNTIME_NAME].registerRuntime === "function") {
      window[SITE_RUNTIME_NAME].registerRuntime({
        id: "rootSunAssetBoot",
        page: "home",
        role: "boot-handoff",
        path: "/index.js",
        version: VERSION,
        rootBootId: ROOT_BOOT_ID,
        contract: ROOT_CONTRACT,
        validated: true,
        optional: false
      });
    }

    canopySource("siteRuntime", {
      path: "/runtime/site_runtime.js",
      loaded: true,
      optional: true
    });
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
        setStatus("Static universe sun active");
        canopyWarning("SITE_RUNTIME_MISSING", "Site runtime did not load; root continues visible-first.", {
          path: SITE_RUNTIME_PATH
        });
        loadSunAssetRuntime();
      }
    );
  }

  function loadSunAssetRuntime() {
    if (window[SUN_ASSET_RUNTIME_NAME] && typeof window[SUN_ASSET_RUNTIME_NAME].start === "function") {
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
        canopySource("sunAssetRuntime", {
          path: "/runtime/sun_asset_runtime.js",
          loaded: true,
          rootBootId: ROOT_BOOT_ID
        });
        mountSunAsset();
      },
      function () {
        bootState.sunAssetRuntimeFailed = true;
        setStatus("Static sun fallback active");
        ensureFallbackSun();
        canopyWarning("SUN_ASSET_RUNTIME_MISSING", "Sun runtime did not load; fallback sun remains visible.", {
          path: SUN_ASSET_RUNTIME_PATH
        });
      }
    );
  }

  function mountSunAsset() {
    var runtime = window[SUN_ASSET_RUNTIME_NAME];

    ensureFallbackSun();

    if (!runtime || typeof runtime.start !== "function") {
      setStatus("Static sun fallback active");
      canopyWarning("SUN_RUNTIME_UNAVAILABLE", "Sun runtime global unavailable; fallback remains active.", {});
      return;
    }

    Promise.resolve(runtime.start({
      selector: "[data-dgb-sun-mount]",
      mode: "canvas",
      seed: 4217,
      intensity: 0.98,
      animate: true,
      frameRate: 10,
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      contract: ROOT_CONTRACT,
      preserveSunVisual: true
    })).then(function () {
      bootState.sunMounted = true;
      markSunRuntimeMounted();
      setStatus("Sun asset active · root-sun-asset-b1");
      canopyVisual("sun", {
        owner: "/assets/sun/sun_canvas.js",
        runtime: "/runtime/sun_asset_runtime.js",
        mounted: true,
        fallbackProtected: true
      });

      if (window[SITE_RUNTIME_NAME] && typeof window[SITE_RUNTIME_NAME].updateRuntimeStatus === "function") {
        window[SITE_RUNTIME_NAME].updateRuntimeStatus("sunAssetRuntime", {
          validated: true,
          loaded: true,
          mounted: true,
          baseline: BASELINE,
          version: VERSION,
          rootBootId: ROOT_BOOT_ID,
          contract: ROOT_CONTRACT
        });
      }
    }).catch(function (error) {
      bootState.sunAssetRuntimeFailed = true;
      setStatus("Static sun fallback active");
      ensureFallbackSun();
      canopyWarning("SUN_ASSET_MOUNT_FAILED", "Sun runtime loaded but failed to mount. Fallback remains visible.", {
        message: error && error.message ? error.message : "unknown",
        baseline: BASELINE,
        version: VERSION,
        rootBootId: ROOT_BOOT_ID,
        contract: ROOT_CONTRACT
      });
    });
  }

  function boot() {
    var visible = protectVisibleRoot();
    if (!visible) return;

    setStatus("Visible-first universe sun canopy active · " + VERSION);
    ensureFallbackSun();
    loadSiteRuntimeThenSunRuntime();

    window.setTimeout(protectVisibleRoot, 500);
    window.setTimeout(protectVisibleRoot, 1600);
    window.setTimeout(ensureFallbackSun, 1800);
    window.setTimeout(function () {
      if (canopy() && typeof canopy().inspect === "function") canopy().inspect();
    }, 2200);
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
        fallbackSunVisible: bootState.fallbackSunVisible,
        compassHeld: bootState.compassHeld,
        baseline: BASELINE,
        version: VERSION,
        rootBootId: ROOT_BOOT_ID,
        contract: ROOT_CONTRACT,
        contractMarkers: ROOT_CONTRACT_MARKERS,
        sunAssetRuntimePath: SUN_ASSET_RUNTIME_PATH
      };
    },
    protectVisibleRoot: protectVisibleRoot,
    protectVisibleDoor: protectVisibleRoot,
    ensureFallbackSun: ensureFallbackSun,
    contractMarkers: ROOT_CONTRACT_MARKERS
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
