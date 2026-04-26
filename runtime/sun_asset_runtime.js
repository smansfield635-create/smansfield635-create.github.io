/* TNT RENEWAL — /runtime/sun_asset_runtime.js
   DGB SUN ASSET RUNTIME · SATELLITE OBSERVATIONAL MOUNT AUTHORITY B8
   VERSION=sun-asset-runtime-satellite-b8
   CANVAS_VERSION=satellite-observational-solar-disc-b8

   PURPOSE:
     - Mount /assets/sun/sun_canvas.js into [data-dgb-sun-mount].
     - Preserve fallback until canvas is successfully mounted.
     - No generated image.
     - No graphic box.
     - Static by default.
     - Resize-safe.
*/

(function () {
  "use strict";

  var RUNTIME_NAME = "DGBSunAssetRuntime";
  var CANOPY_NAME = "DGBSpineCanopy";
  var CANVAS_GLOBAL = "DGBSunCanvas";

  var ROOT_BOOT_ID = "root-sun-asset-b1";
  var VERSION = "sun-asset-runtime-satellite-b8";
  var CANVAS_VERSION = "satellite-observational-solar-disc-b8";

  var PATHS = {
    css: "/assets/sun/sun_material.css?v=" + CANVAS_VERSION,
    canvas: "/assets/sun/sun_canvas.js?v=" + CANVAS_VERSION,
    manifest: "/assets/sun/sun_manifest.json?v=" + CANVAS_VERSION,
    svg: "/assets/sun/sun.svg?v=" + CANVAS_VERSION
  };

  var state = {
    started: false,
    version: VERSION,
    canvasVersion: CANVAS_VERSION,
    rootBootId: ROOT_BOOT_ID,
    mounts: [],
    warnings: [],
    receipts: [],
    resizeTimer: null
  };

  function now() {
    return new Date().toISOString();
  }

  function canopy() {
    return window[CANOPY_NAME] || null;
  }

  function addReceipt(type, payload) {
    var receipt = {
      type: type,
      time: now(),
      payload: payload || {}
    };

    state.receipts.push(receipt);
    while (state.receipts.length > 50) state.receipts.shift();

    try {
      if (canopy() && typeof canopy().addReceipt === "function") {
        canopy().addReceipt("SUN_ASSET_" + type, payload || {});
      }
    } catch (error) {
      /* no-op */
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

    try {
      if (canopy() && typeof canopy().addWarning === "function") {
        canopy().addWarning(code, message, payload || {});
      }
    } catch (error) {
      /* no-op */
    }

    return warning;
  }

  function setStatus(text) {
    var node = document.querySelector("[data-door-boot-status]");
    if (node) node.textContent = text;
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
    link.setAttribute("data-sun-runtime-css", CANVAS_VERSION);

    document.head.appendChild(link);
  }

  function loadScript(path) {
    return new Promise(function (resolve, reject) {
      if (window[CANVAS_GLOBAL] && typeof window[CANVAS_GLOBAL].createCanvasSun === "function") {
        resolve();
        return;
      }

      var base = path.split("?")[0];

      var existing = Array.prototype.slice.call(document.querySelectorAll("script[src]")).find(function (script) {
        var src = script.getAttribute("src") || "";
        return src === path || src.split("?")[0] === base;
      });

      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", function () {
          reject(new Error("Failed to load " + path));
        }, { once: true });

        window.setTimeout(function () {
          if (window[CANVAS_GLOBAL] && typeof window[CANVAS_GLOBAL].createCanvasSun === "function") {
            resolve();
          }
        }, 80);

        return;
      }

      var script = document.createElement("script");
      script.src = path;
      script.defer = true;
      script.setAttribute("data-sun-runtime-loader", CANVAS_VERSION);
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error("Failed to load " + path));
      };

      document.head.appendChild(script);
    });
  }

  function queryMounts(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector || "[data-dgb-sun-mount]"));
  }

  function mountSize(mount) {
    var rect = mount.getBoundingClientRect();
    var width = rect && rect.width ? rect.width : Math.min(window.innerWidth * 0.82, 620);

    return Math.round(Math.max(260, Math.min(width, 760)));
  }

  function removeOldCanvas(mount) {
    Array.prototype.slice.call(mount.querySelectorAll("canvas.dgb-sun-canvas, canvas[data-satellite-sun-canvas]")).forEach(function (canvas) {
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

  function ensureFallback(mount) {
    var fallback = mount.querySelector("[data-sun-fallback]");

    if (!fallback) {
      fallback = document.createElement("div");
      fallback.className = "sun-fallback";
      fallback.setAttribute("data-sun-fallback", "");
      fallback.setAttribute("aria-hidden", "true");
      mount.appendChild(fallback);
    }

    return fallback;
  }

  function describeMount(mount) {
    return {
      id: mount.id || "",
      mode: mount.getAttribute("data-sun-mode") || "",
      assetId: mount.getAttribute("data-sun-asset-id") || "",
      profile: mount.getAttribute("data-sun-visual-profile") || ""
    };
  }

  function mountCanvasSun(mount, options) {
    if (!window[CANVAS_GLOBAL] || typeof window[CANVAS_GLOBAL].createCanvasSun !== "function") {
      addWarning("SUN_CANVAS_GLOBAL_MISSING", "DGBSunCanvas did not expose createCanvasSun.", {
        canvasPath: PATHS.canvas,
        canvasVersion: CANVAS_VERSION
      });

      throw new Error("DGBSunCanvas missing after script load.");
    }

    removeExistingMountRecord(mount);
    removeOldCanvas(mount);

    var fallback = ensureFallback(mount);
    var canvas = document.createElement("canvas");
    var size = mountSize(mount);

    canvas.className = "dgb-sun-canvas";
    canvas.setAttribute("data-satellite-sun-canvas", "true");
    canvas.setAttribute("aria-label", "Satellite observational solar disc");
    canvas.setAttribute("role", "img");

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.aspectRatio = "1";
    canvas.style.borderRadius = "999px";
    canvas.style.position = "relative";
    canvas.style.zIndex = "2";

    mount.appendChild(canvas);

    var instance = window[CANVAS_GLOBAL].createCanvasSun(canvas, Object.assign({
      size: size,
      animate: false,
      intensity: 0.98,
      seed: 4217,
      frameRate: 8,
      rootBootId: ROOT_BOOT_ID,
      runtimeVersion: VERSION,
      canvasVersion: CANVAS_VERSION
    }, options || {}));

    fallback.style.opacity = "0";
    fallback.style.visibility = "hidden";

    mount.setAttribute("data-runtime-mounted", "true");
    mount.setAttribute("data-sun-mode", "canvas");
    mount.setAttribute("data-sun-runtime-version", VERSION);
    mount.setAttribute("data-sun-canvas-version", CANVAS_VERSION);
    mount.setAttribute("data-sun-visual-profile", CANVAS_VERSION);
    mount.setAttribute("data-sun-mounted-by", RUNTIME_NAME);

    setStatus("Sun asset active · satellite view");

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
      node: mount,
      canvas: canvas,
      instance: instance,
      mountedAt: now(),
      repaint: function () {
        var nextSize = mountSize(mount);
        if (instance && typeof instance.update === "function") {
          return instance.update({ size: nextSize });
        }
        return null;
      },
      destroy: function () {
        if (instance && typeof instance.destroy === "function") instance.destroy();
        removeOldCanvas(mount);
        mount.removeAttribute("data-runtime-mounted");
        fallback.style.opacity = "";
        fallback.style.visibility = "";
      },
      getState: function () {
        return instance && typeof instance.getState === "function"
          ? instance.getState()
          : { mode: "canvas", version: VERSION, canvasVersion: CANVAS_VERSION };
      }
    };
  }

  function mountOne(mount, config) {
    ensureCss();
    ensureFallback(mount);

    return loadScript(PATHS.canvas).then(function () {
      var record = mountCanvasSun(mount, config || {});
      state.mounts.push(record);
      return record;
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

  function repaintAll() {
    state.mounts.forEach(function (record) {
      if (record && typeof record.repaint === "function") {
        record.repaint();
      }
    });
  }

  function start(config) {
    if (state.started && state.mounts.length) {
      repaintAll();
      return Promise.resolve(getState());
    }

    state.started = true;
    ensureCss();

    return mountAll((config && config.selector) || undefined, config || {}).then(function () {
      addReceipt("RUNTIME_STARTED", {
        version: VERSION,
        rootBootId: ROOT_BOOT_ID,
        canvasVersion: CANVAS_VERSION
      });

      return getState();
    });
  }

  function stop() {
    state.mounts.forEach(function (record) {
      if (record && typeof record.destroy === "function") record.destroy();
    });

    state.mounts = [];
    state.started = false;

    addReceipt("RUNTIME_STOPPED", {
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      canvasVersion: CANVAS_VERSION
    });
  }

  function resizeSoon() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(repaintAll, 180);
  }

  function getState() {
    return {
      name: RUNTIME_NAME,
      started: state.started,
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      canvasVersion: CANVAS_VERSION,
      mountCount: state.mounts.length,
      warnings: state.warnings.slice(),
      receipts: state.receipts.slice(),
      paths: Object.assign({}, PATHS),
      visualTarget: "satellite observational solar disc",
      externalImageDependency: false,
      graphicGenerationUsed: false
    };
  }

  function validate() {
    return {
      ok: true,
      runtime: RUNTIME_NAME,
      started: state.started,
      version: VERSION,
      rootBootId: ROOT_BOOT_ID,
      canvasVersion: CANVAS_VERSION,
      canvasAvailable: Boolean(window[CANVAS_GLOBAL]),
      mountCount: state.mounts.length,
      externalImageDependency: false,
      graphicGenerationUsed: false,
      mountAuthority: "runtime coordination",
      visualOwner: "/assets/sun/sun_canvas.js",
      visualTarget: "satellite observational solar disc",
      paths: Object.assign({}, PATHS)
    };
  }

  window[RUNTIME_NAME] = Object.freeze({
    version: VERSION,
    canvasVersion: CANVAS_VERSION,
    start: start,
    stop: stop,
    mountAll: mountAll,
    mountOne: mountOne,
    repaintAll: repaintAll,
    getState: getState,
    validate: validate
  });

  function boot() {
    start({ animate: false }).catch(function (error) {
      addWarning("SUN_ASSET_RUNTIME_START_FAILED", error && error.message ? error.message : "Sun runtime failed.", {
        version: VERSION,
        canvasVersion: CANVAS_VERSION
      });
    });
  }

  window.addEventListener("resize", resizeSoon, { passive: true });
  window.addEventListener("orientationchange", resizeSoon, { passive: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
