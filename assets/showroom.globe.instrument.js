/*
 B26F_ASSET_SHOWROOM_GLOBE_MODULE_AWARE_CONSUMER_TNT_v1
 TARGET=/assets/showroom.globe.instrument.js
 PURPOSE:
 Asset showroom globe instrument becomes a module-aware consumer of the Planet 1 renderer facade.
 It calls and verifies /world/render/planet-one.render.js.
 It observes /world/render/planet-one.land.constructs.js and /world/render/planet-one.surface.materials.js.
 It does not draw Planet 1, own land geometry, own surface materials, rewrite gauges, or touch the tree demo.
*/

(function attachShowroomGlobeInstrument(global) {
  "use strict";

  var VERSION = "B26F_ASSET_SHOWROOM_GLOBE_MODULE_AWARE_CONSUMER_TNT_v1";
  var PREVIOUS_VERSION = "SHOWROOM_GLOBE_INSTRUMENT_DEMO_PLANET_VISIBLE_TNT_v1";
  var RENDERER_AUTHORITY = "/world/render/planet-one.render.js";
  var LAND_CONSTRUCTS_AUTHORITY = "/world/render/planet-one.land.constructs.js";
  var SURFACE_MATERIALS_AUTHORITY = "/world/render/planet-one.surface.materials.js";

  var CONTRACT_MARKERS = [
    VERSION,
    PREVIOUS_VERSION,
    "asset-module-aware-consumption-active=true",
    "renderer-facade-consumer-active=true",
    "land-constructs-module-detected-by-asset=true",
    "surface-materials-module-detected-by-asset=true",
    "responsibility-split-observed-by-asset=true",
    "asset-does-not-own-visual-rendering=true",
    "asset-does-not-own-land-geometry=true",
    "asset-does-not-own-surface-materials=true"
  ];

  var lastStatus = null;
  var activeMount = null;
  var activeRenderHost = null;
  var activeReceiptHost = null;
  var scriptPromises = {};

  function now() {
    return global.performance && typeof global.performance.now === "function" ? global.performance.now() : Date.now();
  }

  function boolString(value) {
    return value ? "true" : "false";
  }

  function getRenderer() {
    return global.DGBPlanetOneRenderTeam || null;
  }

  function getLandModule() {
    return global.DGBPlanetOneLandConstructs || null;
  }

  function getSurfaceModule() {
    return global.DGBPlanetOneSurfaceMaterials || null;
  }

  function hasRendererFacade() {
    var renderer = getRenderer();
    return Boolean(renderer && (typeof renderer.renderPlanetOne === "function" || typeof renderer.mount === "function" || typeof renderer.render === "function"));
  }

  function hasLandConstructsModule() {
    var module = getLandModule();
    return Boolean(module && typeof module.createPlanetOneLandConstructs === "function");
  }

  function hasSurfaceMaterialsModule() {
    var module = getSurfaceModule();
    return Boolean(
      module &&
      typeof module.drawPlanetOneOcean === "function" &&
      typeof module.drawPlanetOneConstructSurface === "function" &&
      typeof module.drawPlanetOneAtmosphere === "function"
    );
  }

  function readRendererStatus() {
    var renderer = getRenderer();
    if (renderer && typeof renderer.getStatus === "function") {
      try {
        return renderer.getStatus();
      } catch (error) {
        return { ok: false, error: error && error.message ? error.message : String(error) };
      }
    }
    if (renderer && typeof renderer.status === "function") {
      try {
        return renderer.status();
      } catch (error2) {
        return { ok: false, error: error2 && error2.message ? error2.message : String(error2) };
      }
    }
    return null;
  }

  function readLandStatus() {
    var module = getLandModule();
    if (module && typeof module.getLandConstructStatus === "function") {
      try {
        return module.getLandConstructStatus();
      } catch (error) {
        return { ok: false, error: error && error.message ? error.message : String(error) };
      }
    }
    if (module && typeof module.status === "function") {
      try {
        return module.status();
      } catch (error2) {
        return { ok: false, error: error2 && error2.message ? error2.message : String(error2) };
      }
    }
    return null;
  }

  function readSurfaceStatus() {
    var module = getSurfaceModule();
    if (module && typeof module.getSurfaceMaterialStatus === "function") {
      try {
        return module.getSurfaceMaterialStatus();
      } catch (error) {
        return { ok: false, error: error && error.message ? error.message : String(error) };
      }
    }
    if (module && typeof module.status === "function") {
      try {
        return module.status();
      } catch (error2) {
        return { ok: false, error: error2 && error2.message ? error2.message : String(error2) };
      }
    }
    return null;
  }

  function findExistingScript(path) {
    var scripts;
    var i;
    if (!global.document) return null;
    scripts = global.document.getElementsByTagName("script");
    for (i = 0; i < scripts.length; i += 1) {
      if (scripts[i].src && scripts[i].src.indexOf(path) !== -1) return scripts[i];
    }
    return null;
  }

  function requestScript(key, path, detector) {
    var existing;
    var script;
    var target;

    if (!global.document) return Promise.resolve(false);
    if (detector && detector()) return Promise.resolve(true);
    if (scriptPromises[key]) return scriptPromises[key];

    existing = findExistingScript(path);
    if (existing) {
      scriptPromises[key] = waitForDetector(detector, 2400).then(function (ok) {
        return ok;
      });
      return scriptPromises[key];
    }

    scriptPromises[key] = new Promise(function (resolve) {
      script = global.document.createElement("script");
      script.id = "dgb-showroom-globe-module-" + key;
      script.src = path;
      script.async = false;
      script.defer = false;
      script.onload = function onLoad() {
        waitForDetector(detector, 1400).then(resolve);
      };
      script.onerror = function onError() {
        resolve(false);
      };
      target = global.document.head || global.document.body || global.document.documentElement;
      if (target && typeof target.appendChild === "function") {
        target.appendChild(script);
      } else {
        resolve(false);
      }
    });

    return scriptPromises[key];
  }

  function waitForDetector(detector, timeoutMs) {
    var start = now();
    return new Promise(function (resolve) {
      function tick() {
        if (!detector || detector()) {
          resolve(true);
          return;
        }
        if (now() - start >= timeoutMs) {
          resolve(false);
          return;
        }
        global.setTimeout(tick, 40);
      }
      tick();
    });
  }

  function ensureSplitRenderChain() {
    return Promise.all([
      requestScript("land-constructs", LAND_CONSTRUCTS_AUTHORITY, hasLandConstructsModule),
      requestScript("surface-materials", SURFACE_MATERIALS_AUTHORITY, hasSurfaceMaterialsModule),
      requestScript("renderer-facade", RENDERER_AUTHORITY, hasRendererFacade)
    ]).then(function () {
      return waitForDetector(hasRendererFacade, 2200);
    });
  }

  function injectStyles() {
    var style;
    if (!global.document || global.document.getElementById("dgb-showroom-globe-instrument-styles")) return;

    style = global.document.createElement("style");
    style.id = "dgb-showroom-globe-instrument-styles";
    style.textContent = [
      ".dgb-globe-shell{position:relative;display:grid;justify-items:center;align-content:center;gap:14px;width:100%;min-height:420px;padding:18px;isolation:isolate;}",
      ".dgb-globe-render-host{position:relative;width:100%;display:grid;place-items:center;min-height:340px;}",
      ".dgb-globe-caption{position:relative;z-index:4;max-width:760px;text-align:center;color:rgba(244,247,255,.84);font-size:.78rem;font-weight:950;letter-spacing:.12em;text-transform:uppercase;}",
      ".dgb-globe-telemetry{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;max-width:880px;}",
      ".dgb-globe-telemetry span{border:1px solid rgba(168,199,255,.16);border-radius:999px;padding:5px 8px;background:rgba(255,255,255,.045);color:rgba(244,247,255,.72);font-size:.68rem;font-weight:850;letter-spacing:.04em;text-transform:uppercase;}",
      ".dgb-globe-telemetry span[data-pass='true']{border-color:rgba(137,232,235,.32);color:rgba(202,255,248,.88);}",
      ".dgb-globe-telemetry span[data-pass='false']{border-color:rgba(255,149,117,.28);color:rgba(255,207,196,.82);}",
      ".dgb-globe-telemetry span[data-pass='pending']{border-color:rgba(242,199,111,.26);color:rgba(255,232,183,.82);}",
      ".dgb-globe-fallback{display:grid;place-items:center;width:min(390px,76vw);aspect-ratio:1;border-radius:50%;border:1px solid rgba(242,199,111,.32);background:radial-gradient(circle at 30% 22%,rgba(255,255,255,.16),transparent 22%),radial-gradient(circle at 52% 48%,rgba(40,112,176,.45),rgba(7,16,32,.94) 72%);box-shadow:inset -42px -36px 62px rgba(0,0,0,.58),0 36px 90px rgba(0,0,0,.72);color:rgba(244,247,255,.72);font-size:.72rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase;text-align:center;padding:24px;}",
      "@media (prefers-reduced-motion:reduce){.dgb-globe-shell *{animation:none!important;transition:none!important;}}"
    ].join("");
    global.document.head.appendChild(style);
  }

  function createElement(tag, className, text) {
    var element = global.document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function setReceipt(host, label, value) {
    var node;
    var key;
    if (!host) return;
    key = label.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
    node = host.querySelector("[data-receipt='" + key + "']");
    if (!node) {
      node = createElement("span", "", "");
      node.setAttribute("data-receipt", key);
      host.appendChild(node);
    }
    node.textContent = label + "=" + value;
    if (value === true || value === "true") node.setAttribute("data-pass", "true");
    else if (value === false || value === "false") node.setAttribute("data-pass", "false");
    else node.setAttribute("data-pass", "pending");
  }

  function buildShell(mount, options) {
    var shell;
    var renderHost;
    var captionNode;
    var telemetry;
    var fallback;
    var caption = options.caption || "PLANET 1 · SPLIT RENDER CHAIN · MODULE-AWARE ASSET CONSUMER";

    injectStyles();
    mount.innerHTML = "";
    mount.dataset.instrumentVersion = VERSION;
    mount.dataset.previousInstrumentVersion = PREVIOUS_VERSION;
    mount.dataset.renderStatus = "pending";
    mount.dataset.assetModuleAwareConsumption = "true";
    mount.dataset.assetOwnsVisualRendering = "false";
    mount.dataset.assetOwnsLandGeometry = "false";
    mount.dataset.assetOwnsSurfaceMaterials = "false";

    shell = createElement("div", "dgb-globe-shell");
    renderHost = createElement("div", "dgb-globe-render-host");
    fallback = createElement("div", "dgb-globe-fallback", "Renderer facade pending");
    renderHost.appendChild(fallback);
    captionNode = createElement("div", "dgb-globe-caption", caption);
    telemetry = createElement("div", "dgb-globe-telemetry");

    shell.appendChild(renderHost);
    shell.appendChild(captionNode);
    shell.appendChild(telemetry);
    mount.appendChild(shell);

    activeMount = mount;
    activeRenderHost = renderHost;
    activeReceiptHost = telemetry;

    return {
      shell: shell,
      renderHost: renderHost,
      telemetry: telemetry,
      fallback: fallback
    };
  }

  function callRenderer(renderHost, options) {
    var renderer = getRenderer();
    var renderOptions;
    var result;

    if (!renderer) {
      return { ok: false, reason: "renderer-facade-not-detected" };
    }

    renderOptions = {
      mount: renderHost,
      replace: true,
      animate: options.animate !== false,
      size: options.size,
      rotation: options.rotation,
      rotationSpeed: options.rotationSpeed,
      tilt: options.tilt
    };

    try {
      if (typeof renderer.renderPlanetOne === "function") result = renderer.renderPlanetOne(renderOptions);
      else if (typeof renderer.mount === "function") result = renderer.mount(renderOptions);
      else if (typeof renderer.render === "function") result = renderer.render(renderOptions);
      else result = { ok: false, reason: "renderer-call-surface-missing" };
    } catch (error) {
      result = { ok: false, reason: "renderer-call-threw", error: error && error.message ? error.message : String(error) };
    }

    return result || { ok: false, reason: "renderer-returned-empty-result" };
  }

  function collectStatus(rendererResult) {
    var rendererStatus = readRendererStatus();
    var landStatus = readLandStatus();
    var surfaceStatus = readSurfaceStatus();
    var rendererMounted = Boolean(rendererResult && rendererResult.ok !== false && (rendererResult.canvas || rendererResult.state || rendererResult.ok === true));
    var rendererFacadeActive = Boolean(
      hasRendererFacade() &&
      (!rendererStatus || rendererStatus.rendererFacadeActive !== false) &&
      (!rendererStatus || rendererStatus.responsibilitySplitActive !== false)
    );
    var responsibilitySplitActive = Boolean(
      rendererStatus && rendererStatus.responsibilitySplitActive ||
      rendererResult && rendererResult.responsibilitySplitActive ||
      hasLandConstructsModule() && hasSurfaceMaterialsModule()
    );

    return {
      ok: rendererMounted,
      version: VERSION,
      VERSION: VERSION,
      previousVersion: PREVIOUS_VERSION,
      rendererAuthority: RENDERER_AUTHORITY,
      landConstructsAuthority: LAND_CONSTRUCTS_AUTHORITY,
      surfaceMaterialsAuthority: SURFACE_MATERIALS_AUTHORITY,
      assetCalledRenderer: Boolean(rendererResult),
      rendererDetected: hasRendererFacade(),
      rendererResultMounted: rendererMounted,
      mountComplete: rendererMounted,
      rendererFacadeActive: rendererFacadeActive,
      responsibilitySplitActive: responsibilitySplitActive,
      landConstructsModuleDetected: hasLandConstructsModule(),
      surfaceMaterialsModuleDetected: hasSurfaceMaterialsModule(),
      landConstructsStatus: landStatus,
      surfaceMaterialsStatus: surfaceStatus,
      lastRendererStatus: rendererStatus,
      lastRendererResult: rendererResult || null,
      assetModuleAwareConsumption: true,
      assetOwnsVisualRendering: false,
      assetOwnsLandGeometry: false,
      assetOwnsSurfaceMaterials: false,
      compositionOnly: true,
      markers: CONTRACT_MARKERS.slice(),
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice()
    };
  }

  function writeStatusToDom(status) {
    if (!activeMount || !activeReceiptHost) return;

    activeMount.dataset.renderStatus = status.mountComplete ? "mounted" : "pending";
    activeMount.dataset.rendererDetected = boolString(status.rendererDetected);
    activeMount.dataset.assetCalledRenderer = boolString(status.assetCalledRenderer);
    activeMount.dataset.rendererResultMounted = boolString(status.rendererResultMounted);
    activeMount.dataset.mountComplete = boolString(status.mountComplete);
    activeMount.dataset.rendererFacadeActive = boolString(status.rendererFacadeActive);
    activeMount.dataset.responsibilitySplitActive = boolString(status.responsibilitySplitActive);
    activeMount.dataset.landConstructsModuleDetected = boolString(status.landConstructsModuleDetected);
    activeMount.dataset.surfaceMaterialsModuleDetected = boolString(status.surfaceMaterialsModuleDetected);
    activeMount.dataset.assetModuleAwareConsumption = "true";

    setReceipt(activeReceiptHost, "ASSET_CALLED_RENDERER", status.assetCalledRenderer);
    setReceipt(activeReceiptHost, "RENDERER_RESULT_MOUNTED", status.rendererResultMounted);
    setReceipt(activeReceiptHost, "MOUNT_COMPLETE", status.mountComplete);
    setReceipt(activeReceiptHost, "RENDERER_FACADE_ACTIVE", status.rendererFacadeActive);
    setReceipt(activeReceiptHost, "RESPONSIBILITY_SPLIT_ACTIVE", status.responsibilitySplitActive);
    setReceipt(activeReceiptHost, "LAND_CONSTRUCTS_MODULE_DETECTED", status.landConstructsModuleDetected);
    setReceipt(activeReceiptHost, "SURFACE_MATERIALS_MODULE_DETECTED", status.surfaceMaterialsModuleDetected);
    setReceipt(activeReceiptHost, "ASSET_MODULE_AWARE_CONSUMPTION", true);
  }

  function refreshStatus(rendererResult) {
    lastStatus = collectStatus(rendererResult || (lastStatus && lastStatus.lastRendererResult) || null);
    writeStatusToDom(lastStatus);
    return lastStatus;
  }

  function renderGlobe(mount, options) {
    var config = options || {};
    var shell;
    var earlyResult = null;

    if (!mount) {
      throw new Error("DGBShowroomGlobeInstrument.renderGlobe requires a mount element.");
    }

    shell = buildShell(mount, config);
    refreshStatus(null);

    if (hasRendererFacade()) {
      earlyResult = callRenderer(shell.renderHost, config);
      refreshStatus(earlyResult);
    }

    ensureSplitRenderChain().then(function onChainReady() {
      var result = callRenderer(shell.renderHost, config);
      refreshStatus(result);
      global.setTimeout(function delayedReceiptRefresh() {
        refreshStatus(result);
      }, 260);
      global.setTimeout(function secondDelayedReceiptRefresh() {
        refreshStatus(result);
      }, 1100);
    }).catch(function onChainError(error) {
      lastStatus = collectStatus({
        ok: false,
        reason: "split-render-chain-load-failed",
        error: error && error.message ? error.message : String(error)
      });
      writeStatusToDom(lastStatus);
    });

    return {
      ok: true,
      pending: !earlyResult,
      version: VERSION,
      VERSION: VERSION,
      previousVersion: PREVIOUS_VERSION,
      rendererAuthority: RENDERER_AUTHORITY,
      landConstructsAuthority: LAND_CONSTRUCTS_AUTHORITY,
      surfaceMaterialsAuthority: SURFACE_MATERIALS_AUTHORITY,
      assetModuleAwareConsumption: true,
      assetOwnsVisualRendering: false,
      assetOwnsLandGeometry: false,
      assetOwnsSurfaceMaterials: false,
      rendererDetected: hasRendererFacade(),
      landConstructsModuleDetected: hasLandConstructsModule(),
      surfaceMaterialsModuleDetected: hasSurfaceMaterialsModule(),
      getStatus: getStatus,
      markers: CONTRACT_MARKERS.slice(),
      CONTRACT_MARKERS: CONTRACT_MARKERS.slice()
    };
  }

  function getStatus() {
    return refreshStatus(lastStatus && lastStatus.lastRendererResult ? lastStatus.lastRendererResult : null);
  }

  global.DGBShowroomGlobeInstrument = {
    version: VERSION,
    VERSION: VERSION,
    previousVersion: PREVIOUS_VERSION,
    rendererAuthority: RENDERER_AUTHORITY,
    landConstructsAuthority: LAND_CONSTRUCTS_AUTHORITY,
    surfaceMaterialsAuthority: SURFACE_MATERIALS_AUTHORITY,
    CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
    markers: CONTRACT_MARKERS.slice(),
    renderGlobe: renderGlobe,
    mount: renderGlobe,
    getStatus: getStatus,
    status: getStatus
  };
})(typeof window !== "undefined" ? window : globalThis);
