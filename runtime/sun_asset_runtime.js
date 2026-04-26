(function () {
  "use strict";

  var RUNTIME_NAME = "DGBSunAssetRuntime";
  var SITE_RUNTIME_NAME = "DGBSiteRuntime";
  var CANVAS_GLOBAL = "DGBSunCanvas";
  var VERSION = "luminous-centered-plasma-b5";

  var PATHS = {
    css: "/assets/sun/sun_material.css?v=" + VERSION,
    svg: "/assets/sun/sun.svg?v=" + VERSION,
    canvas: "/assets/sun/sun_canvas.js?v=" + VERSION,
    manifest: "/assets/sun/sun_manifest.json?v=" + VERSION
  };

  var state = {
    started: false,
    mode: "canvas",
    version: VERSION,
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

  function setStatus(text) {
    var node = document.querySelector("[data-door-boot-status]");
    if (node) node.textContent = text;
  }

  function addReceipt(type, payload) {
    var receipt = { type: type, time: now(), payload: payload || {} };

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

    if (existing) return;

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
    var width = rect && rect.width ? rect.width : Math.min(window.innerWidth * 0.92, 700);
    return Math.round(Math.max(320, Math.min(width, 720)));
  }

  function removeExistingMountRecord(mount) {
    state.mounts.forEach(function (record) {
      if (record.node === mount && record.instance && typeof record.instance.destroy === "function") {
        record.instance.destroy();
      }
    });

    state.mounts = state.mounts.filter(function (record) {
      return record.node !== mount;
    });
  }

  function mountCanvasSun(mount, options) {
    clearMount(mount);

    var canvas = document.createElement("canvas");
    canvas.className = "dgb-sun-canvas";
    canvas.setAttribute("aria-label", "Luminous centered plasma sun");
    canvas.setAttribute("role", "img");

    mount.appendChild(canvas);

    var size = getMountSize(mount);
    var instance = window[CANVAS_GLOBAL].createCanvasSun(canvas, Object.assign({
      size: size,
      animate: true,
      intensity: 0.96,
      seed: 4217,
      frameRate: 14
    }, options || {}));

    setStatus("Sun asset active · luminous centered plasma b5");

    addReceipt("CANVAS_SUN_MOUNTED", {
      mount: describeMount(mount),
      size: size,
      version: VERSION,
      profile: "luminous-centered-plasma-b5"
    });

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

  function mountOne(mount, config) {
    ensureCss();
    removeExistingMountRecord(mount);

    return loadScript(PATHS.canvas).then(function () {
      var instance;

      if (!window[CANVAS_GLOBAL]) {
        addWarning("SUN_CANVAS_GLOBAL_MISSING", "Canvas renderer failed to expose DGBSunCanvas.", { version: VERSION });
        throw new Error("DGBSunCanvas missing after script load.");
      }

      instance = mountCanvasSun(mount, config || {});

      state.mounts.push({
        node: mount,
        mode: instance.mode,
        mountedAt: now(),
        element: describeMount(mount),
        instance: instance
      });

      return instance;
    });
  }

  function mountAll(selector, config) {
    var mounts = queryMounts(selector);

    if (!mounts.length) {
      addWarning("SUN_ASSET_MOUNT_MISSING", "No sun asset mount elements were found.", {
        selector: selector || "[data-dgb-sun-mount]",
        version: VERSION
      });
      return Promise.resolve([]);
    }

    return Promise.all(mounts.map(function (mount) {
      return mountOne(mount, config || {});
    }));
  }

  function start(config) {
    state.started = true;
    state.mode = "canvas";

    ensureCss();

    if (siteRuntime() && typeof siteRuntime().registerRuntime === "function") {
      siteRuntime().registerRuntime({
        id: "sunAssetRuntime",
        page: "home",
        role: "sun-asset-spine-coordination",
        path: "/runtime/sun_asset_runtime.js",
        version: VERSION,
        validated: true,
        optional: false
      });
    }

    return mountAll((config && config.selector) || undefined, config || {}).then(function () {
      addReceipt("RUNTIME_STARTED", { mode: state.mode, version: VERSION });
      return getState();
    });
  }

  function stop() {
    state.mounts.forEach(function (mount) {
      if (mount.instance && typeof mount.instance.destroy === "function") {
        mount.instance.destroy();
      }
    });

    state.mounts = [];
    state.started = false;

    addReceipt("RUNTIME_STOPPED", { version: VERSION });
  }

  function getState() {
    return {
      name: RUNTIME_NAME,
      started: state.started,
      mode: state.mode,
      version: state.version,
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
      version: VERSION,
      canvasAvailable: Boolean(window[CANVAS_GLOBAL]),
      externalImageDependency: false,
      graphicGenerationUsed: false,
      cssSunFallbackActive: false,
      mountAuthority: "canvas",
      coordinateSystem: "centered-offscreen-drawImage",
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
      start({ mode: "canvas" });
    }
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      var autoMounts = queryMounts();
      if (autoMounts.length) {
        start({ mode: "canvas" });
      }
    }, { once: true });
  }
})();
