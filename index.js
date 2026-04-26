(function () {
  "use strict";

  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var VERSION = ROOT_BOOT_ID;
  var SITE_RUNTIME_PATH = "/runtime/site_runtime.js?v=" + VERSION;
  var SUN_ASSET_RUNTIME_PATH = "/runtime/sun_asset_runtime.js?v=" + VERSION;
  var SITE_RUNTIME_NAME = "DGBSiteRuntime";
  var SUN_ASSET_RUNTIME_NAME = "DGBSunAssetRuntime";

  var BASELINE = "Generation 1 · Baseline 6";
  var THEME = "Learn to Live to Love";
  var ROOT_CONTRACT = "universe-sun";
  var SUN_ASSET_MOUNT = "sun asset mount";

  var ROOT_CONTRACT_MARKERS = Object.freeze({
    ROOT_BOOT_ID: ROOT_BOOT_ID,
    ROOT_BASELINE: BASELINE,
    ROOT_CONTRACT: ROOT_CONTRACT,
    SUN_ASSET_RUNTIME: "/runtime/sun_asset_runtime.js",
    SUN_ASSET_MOUNT: SUN_ASSET_MOUNT,
    STALE_SOLAR_DOOR_LANGUAGE: "removed",
    TREE_PHYSICAL_DOOR_STRETCH: "removed",
    ROUTE_CONTROL_OBJECT: "spinning-compass-top-controls"
  });

  var bootState = {
    pageVisible: false,
    siteRuntimeRequested: false,
    siteRuntimeLoaded: false,
    siteRuntimeFailed: false,
    sunAssetRuntimeRequested: false,
    sunAssetRuntimeLoaded: false,
    sunAssetRuntimeFailed: false,
    sunMounted: false,
    compassMounted: false,
    version: VERSION,
    rootBootId: ROOT_BOOT_ID
  };

  var routeControls = [
    {
      id: "governance",
      label: "Governance",
      href: "/governance/",
      slot: "north"
    },
    {
      id: "products",
      label: "Products",
      href: "/products/",
      slot: "east"
    },
    {
      id: "laws",
      label: "Laws",
      href: "/laws/",
      slot: "south"
    },
    {
      id: "gauges",
      label: "Gauges",
      href: "/gauges/",
      slot: "west"
    }
  ];

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
        '<main id="door-root" data-universe-sun data-root-boot-id="' + ROOT_BOOT_ID + '" data-root-contract="' + ROOT_CONTRACT + '" style="min-height:100vh;padding:24px;background:#02040b;color:#fff8e7;font-family:system-ui,sans-serif;">' +
        '<p style="margin:0 0 10px;color:rgba(255,217,138,.78);letter-spacing:.16em;text-transform:uppercase;font-size:12px;">Visible-first universe field fallback</p>' +
        '<h1 style="font-size:clamp(44px,12vw,88px);line-height:.88;letter-spacing:-.08em;margin:0;">Diamond Gate Bridge</h1>' +
        '<p style="font-size:clamp(24px,7vw,48px);line-height:.95;letter-spacing:-.06em;margin:18px 0 0;color:#fff8e7;">' + THEME + '</p>' +
        '<p style="max-width:620px;color:rgba(255,248,231,.72);line-height:1.55;margin:18px 0 0;">The universe field fallback is active. The page remains visible even if the sun asset runtime fails.</p>' +
        '<nav style="display:flex;flex-wrap:wrap;gap:10px;margin-top:24px;">' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/products/">Products</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/gauges/">Gauges</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/laws/">Laws</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/governance/">Governance</a>' +
        '</nav>' +
        '<p data-door-boot-status style="margin-top:18px;color:rgba(255,248,231,.58);font-size:12px;letter-spacing:.12em;text-transform:uppercase;">Visible-first fallback active</p>' +
        '</main>';

      setStatus("Visible-first fallback active");
      return false;
    }

    root.setAttribute("data-root-boot-id", ROOT_BOOT_ID);
    root.setAttribute("data-root-baseline", BASELINE);
    root.setAttribute("data-root-contract", ROOT_CONTRACT);
    root.setAttribute("data-sun-asset-mount-contract", SUN_ASSET_MOUNT);
    root.setAttribute("data-route-control-object", "spinning-compass-top-controls");

    bootState.pageVisible = true;

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
  }

  function ensureCompassStyles() {
    if (document.querySelector("style[data-dgb-compass-style='" + ROOT_BOOT_ID + "']")) {
      return;
    }

    var style = document.createElement("style");
    style.setAttribute("data-dgb-compass-style", ROOT_BOOT_ID);
    style.textContent =
      ".root-compass-cluster{" +
      "position:relative;" +
      "z-index:12;" +
      "width:min(92vw,780px);" +
      "min-height:clamp(268px,42vw,430px);" +
      "margin:clamp(20px,4vw,44px) auto;" +
      "display:grid;" +
      "place-items:center;" +
      "pointer-events:none;" +
      "isolation:isolate;" +
      "}" +

      ".root-compass-top{" +
      "--compass-size:clamp(76px,12vw,126px);" +
      "position:absolute;" +
      "width:var(--compass-size);" +
      "min-height:calc(var(--compass-size) + 34px);" +
      "display:grid;" +
      "justify-items:center;" +
      "align-content:start;" +
      "gap:10px;" +
      "text-decoration:none;" +
      "color:rgba(255,247,219,.92);" +
      "pointer-events:auto;" +
      "transform-style:preserve-3d;" +
      "filter:drop-shadow(0 0 18px rgba(255,193,87,.35));" +
      "}" +

      ".root-compass-north{top:0;left:50%;transform:translateX(-50%);}" +
      ".root-compass-east{right:0;top:50%;transform:translateY(-50%);}" +
      ".root-compass-south{bottom:0;left:50%;transform:translateX(-50%);}" +
      ".root-compass-west{left:0;top:50%;transform:translateY(-50%);}" +

      ".root-compass-face{" +
      "position:relative;" +
      "display:block;" +
      "width:var(--compass-size);" +
      "height:var(--compass-size);" +
      "border-radius:999px;" +
      "background:" +
      "radial-gradient(circle at 50% 42%,rgba(255,255,255,.22),transparent 18%)," +
      "radial-gradient(circle at 50% 52%,rgba(255,213,128,.18),transparent 48%)," +
      "conic-gradient(from 0deg,rgba(255,230,170,.22),rgba(255,255,255,.05),rgba(255,202,97,.24),rgba(255,255,255,.05),rgba(255,230,170,.22))," +
      "rgba(20,28,42,.58);" +
      "border:1px solid rgba(255,226,151,.72);" +
      "box-shadow:inset 0 0 18px rgba(255,255,255,.13),inset 0 0 46px rgba(255,194,94,.13),0 0 28px rgba(255,185,70,.22);" +
      "transform-origin:50% 54%;" +
      "animation:rootCompassTopSpin 3.4s linear infinite;" +
      "}" +

      ".root-compass-face:before,.root-compass-face:after{" +
      "content:'';" +
      "position:absolute;" +
      "border-radius:999px;" +
      "pointer-events:none;" +
      "}" +

      ".root-compass-face:before{" +
      "inset:12%;" +
      "border:1px solid rgba(255,239,188,.34);" +
      "background:linear-gradient(90deg,transparent 49%,rgba(255,255,255,.38) 50%,transparent 51%),linear-gradient(0deg,transparent 49%,rgba(255,255,255,.38) 50%,transparent 51%);" +
      "}" +

      ".root-compass-face:after{" +
      "inset:24%;" +
      "border:1px dashed rgba(255,239,188,.32);" +
      "}" +

      ".root-compass-cardinal{" +
      "position:absolute;" +
      "z-index:3;" +
      "font:700 10px/1 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;" +
      "letter-spacing:.08em;" +
      "color:rgba(255,248,219,.9);" +
      "text-shadow:0 0 8px rgba(255,210,116,.5);" +
      "}" +

      ".root-compass-cardinal-n{top:8px;left:50%;transform:translateX(-50%);}" +
      ".root-compass-cardinal-e{right:8px;top:50%;transform:translateY(-50%);}" +
      ".root-compass-cardinal-s{bottom:8px;left:50%;transform:translateX(-50%);}" +
      ".root-compass-cardinal-w{left:8px;top:50%;transform:translateY(-50%);}" +

      ".root-compass-needle{" +
      "position:absolute;" +
      "z-index:4;" +
      "left:50%;" +
      "top:50%;" +
      "width:8px;" +
      "height:62%;" +
      "transform:translate(-50%,-50%);" +
      "transform-origin:50% 50%;" +
      "filter:drop-shadow(0 0 8px rgba(255,219,138,.6));" +
      "}" +

      ".root-compass-needle:before,.root-compass-needle:after{" +
      "content:'';" +
      "position:absolute;" +
      "left:50%;" +
      "width:0;" +
      "height:0;" +
      "transform:translateX(-50%);" +
      "}" +

      ".root-compass-needle:before{" +
      "top:0;" +
      "border-left:7px solid transparent;" +
      "border-right:7px solid transparent;" +
      "border-bottom:calc(var(--compass-size) * .31) solid rgba(255,244,208,.96);" +
      "}" +

      ".root-compass-needle:after{" +
      "bottom:0;" +
      "border-left:6px solid transparent;" +
      "border-right:6px solid transparent;" +
      "border-top:calc(var(--compass-size) * .25) solid rgba(255,178,66,.82);" +
      "}" +

      ".root-compass-pin{" +
      "position:absolute;" +
      "z-index:5;" +
      "left:50%;" +
      "top:50%;" +
      "width:16%;" +
      "height:16%;" +
      "border-radius:999px;" +
      "transform:translate(-50%,-50%);" +
      "background:radial-gradient(circle at 40% 35%,rgba(255,255,255,.95),rgba(255,214,124,.85) 36%,rgba(124,73,22,.72) 74%);" +
      "box-shadow:inset 0 0 7px rgba(255,255,255,.45),0 0 12px rgba(255,197,81,.55);" +
      "}" +

      ".root-compass-label{" +
      "font:700 clamp(.68rem,1.4vw,.88rem)/1.1 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;" +
      "letter-spacing:.08em;" +
      "text-transform:uppercase;" +
      "color:rgba(255,247,219,.88);" +
      "text-shadow:0 0 12px rgba(255,196,93,.42);" +
      "opacity:.92;" +
      "text-align:center;" +
      "}" +

      ".root-compass-top:hover .root-compass-face,.root-compass-top:focus-visible .root-compass-face{" +
      "animation-duration:1.6s;" +
      "box-shadow:inset 0 0 22px rgba(255,255,255,.2),inset 0 0 56px rgba(255,194,94,.18),0 0 38px rgba(255,185,70,.34);" +
      "}" +

      ".root-compass-top:focus-visible{" +
      "outline:2px solid rgba(255,238,186,.78);" +
      "outline-offset:8px;" +
      "border-radius:999px;" +
      "}" +

      "[data-dgb-replaced-by-compass='true']{" +
      "display:none!important;" +
      "}" +

      "@keyframes rootCompassTopSpin{" +
      "0%{transform:perspective(520px) rotateX(62deg) rotateZ(0deg);}" +
      "50%{transform:perspective(520px) rotateX(68deg) rotateZ(180deg);}" +
      "100%{transform:perspective(520px) rotateX(62deg) rotateZ(360deg);}" +
      "}" +

      "@media (max-width:680px){" +
      ".root-compass-cluster{width:min(94vw,420px);min-height:340px;}" +
      ".root-compass-east{right:4px;}" +
      ".root-compass-west{left:4px;}" +
      ".root-compass-label{max-width:96px;}" +
      "}" +

      "@media (prefers-reduced-motion:reduce){" +
      ".root-compass-face{animation:none;transform:perspective(520px) rotateX(64deg) rotateZ(-18deg);}" +
      "}";

    document.head.appendChild(style);
  }

  function makeCompassControl(route) {
    var link = document.createElement("a");
    link.className = "root-compass-top root-compass-" + route.slot;
    link.href = route.href;
    link.setAttribute("aria-label", route.label);
    link.setAttribute("data-dgb-route-control", route.id);
    link.setAttribute("data-route-control-object", "spinning-compass-top");

    var face = document.createElement("span");
    face.className = "root-compass-face";
    face.setAttribute("aria-hidden", "true");

    var n = document.createElement("span");
    n.className = "root-compass-cardinal root-compass-cardinal-n";
    n.textContent = "N";

    var e = document.createElement("span");
    e.className = "root-compass-cardinal root-compass-cardinal-e";
    e.textContent = "E";

    var s = document.createElement("span");
    s.className = "root-compass-cardinal root-compass-cardinal-s";
    s.textContent = "S";

    var w = document.createElement("span");
    w.className = "root-compass-cardinal root-compass-cardinal-w";
    w.textContent = "W";

    var needle = document.createElement("span");
    needle.className = "root-compass-needle";

    var pin = document.createElement("span");
    pin.className = "root-compass-pin";

    var label = document.createElement("span");
    label.className = "root-compass-label";
    label.textContent = route.label;

    face.appendChild(n);
    face.appendChild(e);
    face.appendChild(s);
    face.appendChild(w);
    face.appendChild(needle);
    face.appendChild(pin);

    link.appendChild(face);
    link.appendChild(label);

    return link;
  }

  function hideLegacyBubbleControls(root) {
    var selectors = [
      "[data-door-bubble]",
      "[data-root-bubble]",
      "[data-bubble-route]",
      "[data-route-bubble]",
      "[data-sun-bubble]",
      ".door-bubble",
      ".root-bubble",
      ".sun-bubble",
      ".universe-bubble",
      ".bubble-route",
      ".route-bubble",
      ".door-route-bubble",
      ".root-route-bubble",
      ".solar-bubble",
      ".orbit-bubble"
    ];

    selectors.forEach(function (selector) {
      Array.prototype.slice.call(root.querySelectorAll(selector)).forEach(function (node) {
        if (node.closest(".root-compass-cluster")) return;
        node.setAttribute("data-dgb-replaced-by-compass", "true");
        node.setAttribute("aria-hidden", "true");
      });
    });
  }

  function mountCompassControls() {
    var root = getRoot();
    if (!root) return false;

    ensureCompassStyles();
    hideLegacyBubbleControls(root);

    var existing = root.querySelector(".root-compass-cluster");
    if (existing) {
      bootState.compassMounted = true;
      return true;
    }

    var cluster = document.createElement("section");
    cluster.className = "root-compass-cluster";
    cluster.setAttribute("aria-label", "Diamond Gate Bridge route compass controls");
    cluster.setAttribute("data-root-compass-cluster", ROOT_BOOT_ID);
    cluster.setAttribute("data-root-contract", ROOT_CONTRACT);

    routeControls.forEach(function (route) {
      cluster.appendChild(makeCompassControl(route));
    });

    var sunMount = root.querySelector("[data-dgb-sun-mount]");
    var preferredMount = root.querySelector("[data-root-compass-mount]");

    if (preferredMount) {
      preferredMount.innerHTML = "";
      preferredMount.appendChild(cluster);
    } else if (sunMount && sunMount.parentNode) {
      sunMount.parentNode.insertBefore(cluster, sunMount.nextSibling);
    } else {
      root.appendChild(cluster);
    }

    bootState.compassMounted = true;

    if (window[SITE_RUNTIME_NAME] && typeof window[SITE_RUNTIME_NAME].registerRuntime === "function") {
      window[SITE_RUNTIME_NAME].registerRuntime({
        id: "rootCompassTopControls",
        page: "home",
        role: "route-control-surface",
        path: "/index.js",
        version: VERSION,
        rootBootId: ROOT_BOOT_ID,
        contract: ROOT_CONTRACT,
        validated: true,
        optional: false
      });
    }

    return true;
  }

  function scheduleCompassMounts() {
    mountCompassControls();
    window.setTimeout(mountCompassControls, 240);
    window.setTimeout(mountCompassControls, 900);
    window.setTimeout(mountCompassControls, 1800);
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
            { path: SUN_ASSET_RUNTIME_PATH, baseline: BASELINE, version: VERSION, rootBootId: ROOT_BOOT_ID }
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

    Promise.resolve(runtime.start({
      selector: "[data-dgb-sun-mount]",
      mode: "canvas",
      seed: 4217,
      intensity: 0.98,
      animate: true,
      frameRate: 10,
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      contract: ROOT_CONTRACT
    })).then(function () {
      bootState.sunMounted = true;
      setStatus("Sun asset active · " + VERSION);
      scheduleCompassMounts();

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
      setStatus("Sun asset mount failed");
      scheduleCompassMounts();

      if (window[SITE_RUNTIME_NAME] && typeof window[SITE_RUNTIME_NAME].addWarning === "function") {
        window[SITE_RUNTIME_NAME].addWarning(
          "SUN_ASSET_MOUNT_FAILED",
          "Universe Scale Field runtime loaded but failed to mount.",
          {
            message: error && error.message ? error.message : "unknown",
            baseline: BASELINE,
            version: VERSION,
            rootBootId: ROOT_BOOT_ID,
            contract: ROOT_CONTRACT
          }
        );
      }
    });
  }

  function boot() {
    var visible = protectVisibleRoot();
    if (!visible) return;

    setStatus("Visible-first universe field active · " + VERSION);
    scheduleCompassMounts();
    loadSiteRuntimeThenSunRuntime();

    window.setTimeout(protectVisibleRoot, 500);
    window.setTimeout(protectVisibleRoot, 1600);
    window.setTimeout(scheduleCompassMounts, 2200);
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
        compassMounted: bootState.compassMounted,
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
    mountCompassControls: mountCompassControls,
    contractMarkers: ROOT_CONTRACT_MARKERS
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
