(function () {
  "use strict";

  var RUNTIME_NAME = "DGBSunAssetRuntime";
  var SITE_RUNTIME_NAME = "DGBSiteRuntime";
  var CANOPY_NAME = "DGBSpineCanopy";
  var CANVAS_GLOBAL = "DGBSunCanvas";

  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var VERSION = "universe-scale-field-b7";
  var CANVAS_VERSION = "satellite-solar-disc-b6";

  var PATHS = {
    css: "/assets/sun/sun_material.css?v=" + ROOT_BOOT_ID,
    svg: "/assets/sun/sun.svg?v=" + CANVAS_VERSION,
    canvas: "/assets/sun/sun_canvas.js?v=" + CANVAS_VERSION,
    manifest: "/assets/sun/sun_manifest.json?v=" + ROOT_BOOT_ID
  };

  var state = {
    started: false,
    mode: "canvas",
    version: VERSION,
    rootBootId: ROOT_BOOT_ID,
    canvasVersion: CANVAS_VERSION,
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

  function canopy() {
    return window[CANOPY_NAME] || null;
  }

  function setStatus(text) {
    var node = document.querySelector("[data-door-boot-status]");
    if (node) node.textContent = text;
  }

  function addReceipt(type, payload) {
    var receipt = {
      type: type,
      time: now(),
      payload: payload || {}
    };

    state.receipts.push(receipt);
    while (state.receipts.length > 50) state.receipts.shift();

    if (siteRuntime() && typeof siteRuntime().addReceipt === "function") {
      siteRuntime().addReceipt("SUN_ASSET_" + type, payload || {});
    }

    if (canopy() && typeof canopy().addReceipt === "function") {
      canopy().addReceipt("SUN_ASSET_" + type, payload || {});
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
    while (state.warnings.length > 50) state.warnings.shift();

    if (siteRuntime() && typeof siteRuntime().addWarning === "function") {
      siteRuntime().addWarning(code, message, payload || {});
    }

    if (canopy() && typeof canopy().addWarning === "function") {
      canopy().addWarning(code, message, payload || {});
    }

    return warning;
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

  function loadScript(path) {
    return new Promise(function (resolve, reject) {
      var base = path.split("?")[0];
      var existing = Array.prototype.slice.call(document.querySelectorAll("script[src]")).find(function (script) {
        var src = script.getAttribute("src") || "";
        return src === path || src.split("?")[0] === base;
      });

      if (existing && window[CANVAS_GLOBAL]) {
        resolve();
        return;
      }

      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", function () {
          reject(new Error("Failed to load " + path));
        }, { once: true });
        return;
      }

      var script = document.createElement("script");
      script.src = path;
      script.defer = true;
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error("Failed to load " + path));
      };
      document.body.appendChild(script);
    });
  }

  function ensureCss() {
    var base = PATHS.css.split("?")[0];
    var existing = Array.prototype.slice.call(document.querySelectorAll("link[rel='stylesheet'][href]")).find(function (link) {
      var href = link.getAttribute("href") || "";
      return href === PATHS.css || href.split("?")[0] === base;
    });

    if (existing) return;

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = PATHS.css;
    document.head.appendChild(link);
  }

  function describeMount(mount) {
    return {
      id: mount.id || "",
      selector: mount.getAttribute("data-dgb-sun-mount") || "",
      mode: mount.getAttribute("data-sun-mode") || "",
      assetId: mount.getAttribute("data-sun-asset-id") || ""
    };
  }

  function getMountSize(mount) {
    var rect = mount.getBoundingClientRect();
    var width = rect && rect.width ? rect.width : Math.min(window.innerWidth * 0.76, 470);
    return Math.round(Math.max(280, Math.min(width, 520)));
  }

  function removeOldCanvas(mount) {
    Array.prototype.slice.call(mount.querySelectorAll("canvas.dgb-sun-canvas")).forEach(function (canvas) {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    });
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

  function markMounted(mount) {
    mount.setAttribute("data-runtime-mounted", "true");
    mount.setAttribute("data-sun-runtime-version", VERSION);
    mount.setAttribute("data-sun-canvas-version", CANVAS_VERSION);
  }

  function mountCanvasSun(mount, options) {
    var canvas;
    var size;
    var instance;

    if (!window[CANVAS_GLOBAL] || typeof window[CANVAS_GLOBAL].createCanvasSun !== "function") {
      addWarning("SUN_CANVAS_GLOBAL_MISSING", "Canvas renderer failed to expose DGBSunCanvas.", {
        canvasPath: PATHS.canvas,
        canvasVersion: CANVAS_VERSION
      });
      throw new Error("DGBSunCanvas missing after script load.");
    }

    removeExistingMountRecord(mount);
    removeOldCanvas(mount);

    canvas = document.createElement("canvas");
    canvas.className = "dgb-sun-canvas";
    canvas.setAttribute("aria-label", "Satellite-style solar disc within universe scale field");
    canvas.setAttribute("role", "img");

    mount.appendChild(canvas);

    size = getMountSize(mount);

    instance = window[CANVAS_GLOBAL].createCanvasSun(canvas, Object.assign({
      size: size,
      animate: true,
      intensity: 0.98,
      seed: 4217,
      frameRate: 10,
      rootBootId: ROOT_BOOT_ID,
      runtimeVersion: VERSION,
      canvasVersion: CANVAS_VERSION
    }, options || {}));

    markMounted(mount);

    setStatus("Sun asset active · root-sun-asset-b1");

    canopyVisual("sun", {
      visualOwner: "/assets/sun/sun_canvas.js",
      runtimeOwner: "/runtime/sun_asset_runtime.js",
      mounted: true,
      canvasVersion: CANVAS_VERSION,
      runtimeVersion: VERSION,
      rootBootId: ROOT_BOOT_ID
    });

    addReceipt("CANVAS_SUN_MOUNTED", {
      mount: describeMount(mount),
      size: size,
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      canvasVersion: CANVAS_VERSION,
      profile: CANVAS_VERSION
    });

    return {
      mode: "canvas",
      destroy: function () {
        if (instance && typeof instance.destroy === "function") instance.destroy();
        removeOldCanvas(mount);
        mount.removeAttribute("data-runtime-mounted");
      },
      getState: instance && typeof instance.getState === "function" ? instance.getState : function () {
        return {
          mode: "canvas",
          version: VERSION,
          canvasVersion: CANVAS_VERSION
        };
      }
    };
  }

  function queryMounts(selector) {
    var selected = selector || "[data-dgb-sun-mount]";
    return Array.prototype.slice.call(document.querySelectorAll(selected));
  }

  function mountOne(mount, config) {
    ensureCss();

    canopySource("sunCanvas", {
      path: "/assets/sun/sun_canvas.js",
      version: CANVAS_VERSION,
      role: "sun visual owner"
    });

    return loadScript(PATHS.canvas).then(function () {
      var instance = mountCanvasSun(mount, config || {});

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
        version: VERSION,
        rootBootId: ROOT_BOOT_ID
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

    canopySource("sunAssetRuntime", {
      path: "/runtime/sun_asset_runtime.js",
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      canvasVersion: CANVAS_VERSION,
      mountAuthority: "runtime coordination only"
    });

    if (siteRuntime() && typeof siteRuntime().registerRuntime === "function") {
      siteRuntime().registerRuntime({
        id: "sunAssetRuntime",
        page: "home",
        role: "sun-asset-runtime-coordination",
        path: "/runtime/sun_asset_runtime.js",
        version: VERSION,
        rootBootId: ROOT_BOOT_ID,
        canvasVersion: CANVAS_VERSION,
        validated: true,
        optional: false
      });
    }

    return mountAll((config && config.selector) || undefined, config || {}).then(function () {
      addReceipt("RUNTIME_STARTED", {
        mode: state.mode,
        version: VERSION,
        rootBootId: ROOT_BOOT_ID,
        canvasVersion: CANVAS_VERSION
      });
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

    addReceipt("RUNTIME_STOPPED", {
      version: VERSION,
      rootBootId: ROOT_BOOT_ID
    });
  }

  function getState() {
    return {
      name: RUNTIME_NAME,
      started: state.started,
      mode: state.mode,
      version: state.version,
      rootBootId: state.rootBootId,
      canvasVersion: state.canvasVersion,
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
      rootBootId: ROOT_BOOT_ID,
      canvasVersion: CANVAS_VERSION,
      canvasAvailable: Boolean(window[CANVAS_GLOBAL]),
      externalImageDependency: false,
      graphicGenerationUsed: false,
      cssSunFallbackActive: Boolean(document.querySelector("[data-sun-fallback]")),
      mountAuthority: "runtime coordination",
      visualOwner: "/assets/sun/sun_canvas.js",
      visualTarget: "satellite solar disc inside 256M km universe field",
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
})();
