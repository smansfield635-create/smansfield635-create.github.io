(function () {
  "use strict";

  var RUNTIME_NAME = "DGBSunAssetRuntime";
  var SITE_RUNTIME_NAME = "DGBSiteRuntime";
  var CANVAS_GLOBAL = "DGBSunCanvas";

  var PATHS = {
    css: "/assets/sun/sun_material.css",
    svg: "/assets/sun/sun.svg",
    canvas: "/assets/sun/sun_canvas.js",
    manifest: "/assets/sun/sun_manifest.json"
  };

  var state = {
    started: false,
    mode: "canvas",
    mounts: [],
    warnings: [],
    receipts: []
  };

  function now() {
    return new Date().toISOString();
  }

  function siteRuntime() {
    return window[SITE_RUNTIME_NAME] || null;
  }

  function addReceipt(type, payload) {
    var receipt = {
      type: type,
      time: now(),
      payload: payload || {}
    };

    state.receipts.push(receipt);

    if (state.receipts.length > 50) {
      state.receipts.shift();
    }

    if (siteRuntime() && typeof siteRuntime().addReceipt === "function") {
      siteRuntime().addReceipt("SUN_ASSET_" + type, payload || {});
    }

    return receipt;
  }

  function addWarning(code, message, payload) {
    var warning = {
      code: code,
      message: message,
      time: now(),
      payload: payload || {}
    };

    state.warnings.push(warning);

    if (state.warnings.length > 50) {
      state.warnings.shift();
    }

    if (siteRuntime() && typeof siteRuntime().addWarning === "function") {
      siteRuntime().addWarning(code, message, payload || {});
    }

    return warning;
  }

  function loadScript(path) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + path + '"]');
      if (existing) {
        resolve();
        return;
      }

      var script = document.createElement("script");
      script.src = path;
      script.defer = true;
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error("Failed to load " + path)); };
      document.body.appendChild(script);
    });
  }

  function ensureCss() {
    var existing = document.querySelector('link[href="' + PATHS.css + '"]');

    if (existing) {
      return;
    }

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = PATHS.css;
    document.head.appendChild(link);
  }

  function clearMount(mount) {
    while (mount.firstChild) {
      mount.removeChild(mount.firstChild);
    }
  }

  function describeMount(mount) {
    return {
      id: mount.id || "",
      selector: mount.getAttribute("data-dgb-sun-mount") || "",
      mode: mount.getAttribute("data-sun-mode") || ""
    };
  }

  function getMountSize(mount) {
    var rect = mount.getBoundingClientRect();
    var width = rect && rect.width ? rect.width : Math.min(window.innerWidth * 0.82, 520);
    return Math.round(Math.max(280, Math.min(width, 560)));
  }

  function mountCssSun(mount) {
    clearMount(mount);

    var stage = document.createElement("div");
    stage.className = "dgb-sun-stage";

    var sun = document.createElement("div");
    sun.className = "dgb-sun-css";

    var core = document.createElement("div");
    core.className = "dgb-sun-core";

    sun.appendChild(core);
    stage.appendChild(sun);
    mount.appendChild(stage);

    addReceipt("CSS_SUN_MOUNTED", { mount: describeMount(mount) });

    return {
      mode: "css",
      destroy: function () {
        clearMount(mount);
      }
    };
  }

  function mountSvgSun(mount) {
    clearMount(mount);

    var img = document.createElement("img");
    img.className = "dgb-sun-svg";
    img.src = PATHS.svg;
    img.alt = "Procedural sun SVG asset";
    img.loading = "eager";
    img.decoding = "async";

    mount.appendChild(img);

    addReceipt("SVG_SUN_MOUNTED", { mount: describeMount(mount), path: PATHS.svg });

    return {
      mode: "svg",
      destroy: function () {
        clearMount(mount);
      }
    };
  }

  function mountCanvasSun(mount, options) {
    clearMount(mount);

    var canvas = document.createElement("canvas");
    canvas.className = "dgb-sun-canvas";
    canvas.setAttribute("aria-label", "Procedural canvas sun asset");
    canvas.setAttribute("role", "img");

    mount.appendChild(canvas);

    var size = getMountSize(mount);
    var instance = window[CANVAS_GLOBAL].createCanvasSun(canvas, Object.assign({
      size: size,
      animate: true,
      intensity: 0.78,
      seed: 4217
    }, options || {}));

    addReceipt("CANVAS_SUN_MOUNTED", { mount: describeMount(mount), size: size });

    return {
      mode: "canvas",
      destroy: function () {
        instance.destroy();
        clearMount(mount);
      },
      getState: instance.getState
    };
  }

  function queryMounts(selector) {
    var selected = selector || "[data-dgb-sun-mount]";
    return Array.prototype.slice.call(document.querySelectorAll(selected));
  }

  async function mountOne(mount, config) {
    ensureCss();

    var mode = (config && config.mode) || mount.getAttribute("data-sun-mode") || state.mode || "canvas";
    var instance;

    if (mode === "svg") {
      instance = mountSvgSun(mount);
    } else if (mode === "css") {
      instance = mountCssSun(mount);
    } else {
      await loadScript(PATHS.canvas);

      if (!window[CANVAS_GLOBAL]) {
        addWarning("SUN_CANVAS_GLOBAL_MISSING", "Canvas renderer failed to expose DGBSunCanvas.");
        instance = mountCssSun(mount);
      } else {
        instance = mountCanvasSun(mount, config || {});
      }
    }

    state.mounts.push({
      mode: instance.mode,
      mountedAt: now(),
      element: describeMount(mount),
      instance: instance
    });

    return instance;
  }

  async function mountAll(selector, config) {
    var mounts = queryMounts(selector);

    if (!mounts.length) {
      addWarning("SUN_ASSET_MOUNT_MISSING", "No sun asset mount elements were found.", {
        selector: selector || "[data-dgb-sun-mount]"
      });
      return [];
    }

    var results = [];

    for (var i = 0; i < mounts.length; i += 1) {
      results.push(await mountOne(mounts[i], config || {}));
    }

    return results;
  }

  async function start(config) {
    if (state.started) {
      return getState();
    }

    state.started = true;
    state.mode = (config && config.mode) || state.mode;

    ensureCss();

    if (siteRuntime() && typeof siteRuntime().registerRuntime === "function") {
      siteRuntime().registerRuntime({
        id: "sunAssetRuntime",
        page: "asset-layer",
        role: "sun-asset-coordination",
        path: "/runtime/sun_asset_runtime.js",
        validated: true,
        optional: true
      });
    }

    await mountAll((config && config.selector) || undefined, config || {});
    addReceipt("RUNTIME_STARTED", { mode: state.mode });

    return getState();
  }

  function stop() {
    state.mounts.forEach(function (mount) {
      if (mount.instance && typeof mount.instance.destroy === "function") {
        mount.instance.destroy();
      }
    });

    state.mounts = [];
    state.started = false;

    addReceipt("RUNTIME_STOPPED");
  }

  function getState() {
    return {
      name: RUNTIME_NAME,
      started: state.started,
      mode: state.mode,
      mountCount: state.mounts.length,
      warnings: state.warnings.slice(),
      receipts: state.receipts.slice(),
      paths: Object.assign({}, PATHS)
    };
  }

  function validate() {
    return {
      ok: true,
      runtime: RUNTIME_NAME,
      started: state.started,
      mode: state.mode,
      canvasAvailable: Boolean(window[CANVAS_GLOBAL]),
      externalImageDependency: false,
      graphicGenerationUsed: false,
      paths: Object.assign({}, PATHS)
    };
  }

  window[RUNTIME_NAME] = Object.freeze({
    start: start,
    stop: stop,
    mountAll: mountAll,
    mountOne: mountOne,
    getState: getState,
    validate: validate
  });

  if (document.readyState !== "loading") {
    var autoMounts = queryMounts();

    if (autoMounts.length) {
      start({
        mode: autoMounts[0].getAttribute("data-sun-mode") || "canvas"
      });
    }
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      var autoMounts = queryMounts();

      if (autoMounts.length) {
        start({
          mode: autoMounts[0].getAttribute("data-sun-mode") || "canvas"
        });
      }
    }, { once: true });
  }
})();
