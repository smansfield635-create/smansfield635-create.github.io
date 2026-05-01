/*
 B26G_SHOWROOM_RUNTIME_SPLIT_RENDER_CHAIN_AWARENESS_TNT_v1
 TARGET=/showroom/runtime.js
 PURPOSE:
 Runtime renewal after the Planet 1 render split and asset-consumer alignment.
 The runtime owns route/session receipts, the inspection boundary, lazy activation, pause/resume,
 and split-chain observation. It does not draw Planet 1, own land geometry, own surface materials,
 or bypass /assets/showroom.globe.instrument.js.
*/

(function attachShowroomRuntime(global) {
  "use strict";

  var VERSION = "B26G_SHOWROOM_RUNTIME_SPLIT_RENDER_CHAIN_AWARENESS_TNT_v1";
  var PREVIOUS_VERSION = "SHOWROOM_RUNTIME_INSPECTION_BOUNDARY_AND_LAZY_RENDER_TNT_v1";
  var GENERATION = "GENERATION_4";
  var GEN4_TYPE = "narrative-code";
  var AUTHORITY = "/showroom/runtime.js";
  var ASSET_PATH = "/assets/showroom.globe.instrument.js";
  var RENDERER_PATH = "/world/render/planet-one.render.js";
  var LAND_PATH = "/world/render/planet-one.land.constructs.js";
  var SURFACE_PATH = "/world/render/planet-one.surface.materials.js";
  var PHASE_SEQUENCE = Object.freeze(["HOME", "BOUNDARY", "MOTION", "REALM", "RECEIPT", "NEXT"]);
  var INSPECTION_HASHES = Object.freeze(["#planet-one-render", "#globe-main", "#inspection-title", "#planet-one-inspection"]);

  var CONTRACT_MARKERS = [
    VERSION,
    PREVIOUS_VERSION,
    "runtime-split-render-chain-awareness-active=true",
    "runtime-loads-asset-instrument=true",
    "runtime-does-not-bypass-asset-instrument=true",
    "runtime-observes-renderer-facade=true",
    "runtime-observes-land-constructs-module=true",
    "runtime-observes-surface-materials-module=true",
    "runtime-owns-inspection-boundary=true",
    "runtime-does-not-own-renderer=true",
    "runtime-does-not-own-land-geometry=true",
    "runtime-does-not-own-surface-materials=true",
    "single-render-loop=true",
    "pause-render-when-hidden=true",
    "pause-render-when-offscreen=true"
  ];

  var scriptPromises = {};
  var receipts = [];
  var sessions = {};

  var status = {
    generation: GENERATION,
    gen4Type: GEN4_TYPE,
    runtimeAuthority: AUTHORITY,
    runtimeVersion: VERSION,
    previousVersion: PREVIOUS_VERSION,
    receiptLedger: true,
    ownsMotion: false,
    ownsSpeed: false,
    ownsPlacement: false,
    ownsRenderer: false,
    ownsRenderBoundary: true,
    ownsAssetConsumer: false,
    ownsLandGeometry: false,
    ownsSurfaceMaterials: false,
    phaseSequence: PHASE_SEQUENCE.join(" -> "),
    showroomLobbyMode: true,
    showroomInspectionMode: true,
    lazyRenderGate: true,
    inspectionBoundaryActive: true,
    singleRenderLoop: true,
    pauseRenderWhenHidden: true,
    pauseRenderWhenOffscreen: true,
    assetInstrumentPath: ASSET_PATH,
    planetOneRenderer: RENDERER_PATH,
    landConstructsPath: LAND_PATH,
    surfaceMaterialsPath: SURFACE_PATH,
    assetInstrumentDetected: false,
    rendererFacadeDetected: false,
    landConstructsModuleDetected: false,
    surfaceMaterialsModuleDetected: false,
    assetModuleAwareConsumption: false,
    responsibilitySplitActive: false,
    rendererFacadeActive: false,
    splitRenderChainAware: true,
    inspectionActive: false,
    assetLoaded: false,
    renderLoaded: false,
    renderPaused: true,
    renderMountVisible: false,
    markers: CONTRACT_MARKERS.slice()
  };

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      return null;
    }
  }

  function now() {
    return new Date().toISOString();
  }

  function normalizePath(pathname) {
    var raw = String(pathname || "/");
    return raw === "/" || raw.charAt(raw.length - 1) === "/" ? raw : raw + "/";
  }

  function getRouteState(pathname, hash) {
    var loc = global.location || { pathname: "/", hash: "" };
    var path = normalizePath(pathname || loc.pathname || "/");
    var currentHash = typeof hash === "string" ? hash : (loc.hash || "");
    var isParentShowroom = path === "/showroom/";
    var isInspectionRoute = path === "/showroom/globe/";
    var isInspectionHash = INSPECTION_HASHES.indexOf(currentHash) !== -1;

    return {
      path: path,
      hash: currentHash,
      isParentShowroom: isParentShowroom,
      isInspectionRoute: isInspectionRoute,
      isInspectionHash: isInspectionHash,
      mode: isInspectionRoute || isInspectionHash ? "inspection" : isParentShowroom ? "lobby" : "external"
    };
  }

  function makeEvent(name, detail) {
    if (typeof global.CustomEvent === "function") {
      return new global.CustomEvent(name, { detail: detail });
    }

    if (global.document && typeof global.document.createEvent === "function") {
      var event = global.document.createEvent("CustomEvent");
      event.initCustomEvent(name, false, false, detail);
      return event;
    }

    return null;
  }

  function publish(type, receipt) {
    var runtimeEvent;
    var ledgerEvent;

    if (!global.dispatchEvent) return;

    runtimeEvent = makeEvent("showroom:runtime-receipt", clone(receipt));
    ledgerEvent = makeEvent("showroom:true-gen4-ledger", {
      type: type,
      generation: GENERATION,
      gen4Type: GEN4_TYPE,
      receipt: clone(receipt),
      status: clone(status)
    });

    if (runtimeEvent) global.dispatchEvent(runtimeEvent);
    if (ledgerEvent) global.dispatchEvent(ledgerEvent);
  }

  function pushReceipt(type, payload, session) {
    var route = getRouteState();
    var receipt = {
      type: type,
      generation: GENERATION,
      gen4Type: GEN4_TYPE,
      runtimeAuthority: AUTHORITY,
      runtimeVersion: VERSION,
      previousVersion: PREVIOUS_VERSION,
      ownsRenderer: false,
      ownsRenderBoundary: true,
      ownsAssetConsumer: false,
      ownsLandGeometry: false,
      ownsSurfaceMaterials: false,
      splitRenderChainAware: true,
      sessionId: session ? session.sessionId : null,
      route: session ? session.route : route.path,
      realm: session ? session.realm : null,
      routeRole: session ? session.routeRole : route.mode,
      payload: payload || {},
      timestamp: now()
    };

    receipts.push(receipt);
    if (receipts.length > 180) {
      receipts.splice(0, receipts.length - 180);
    }

    status.lastReceiptType = type;
    status.lastReceiptAt = receipt.timestamp;
    status.activeRoute = receipt.route;
    status.activeRouteRole = receipt.routeRole;
    status.activeMode = route.mode;
    status.updatedAt = receipt.timestamp;

    publish(type, receipt);
    return clone(receipt);
  }

  function getAsset() {
    return global.DGBShowroomGlobeInstrument || null;
  }

  function getRenderer() {
    return global.DGBPlanetOneRenderTeam || null;
  }

  function getLand() {
    return global.DGBPlanetOneLandConstructs || null;
  }

  function getSurface() {
    return global.DGBPlanetOneSurfaceMaterials || null;
  }

  function hasAsset() {
    var asset = getAsset();
    return Boolean(asset && typeof asset.renderGlobe === "function");
  }

  function hasRenderer() {
    var renderer = getRenderer();
    return Boolean(
      renderer &&
      (
        typeof renderer.renderPlanetOne === "function" ||
        typeof renderer.mount === "function" ||
        typeof renderer.render === "function"
      )
    );
  }

  function hasLand() {
    var land = getLand();
    return Boolean(land && typeof land.createPlanetOneLandConstructs === "function");
  }

  function hasSurface() {
    var surface = getSurface();
    return Boolean(
      surface &&
      typeof surface.drawPlanetOneOcean === "function" &&
      typeof surface.drawPlanetOneConstructSurface === "function" &&
      typeof surface.drawPlanetOneAtmosphere === "function"
    );
  }

  function callStatus(target, primary, secondary) {
    if (!target) return null;

    try {
      if (typeof target[primary] === "function") return target[primary]();
      if (secondary && typeof target[secondary] === "function") return target[secondary]();
    } catch (error) {
      return {
        ok: false,
        error: String(error && error.message ? error.message : error)
      };
    }

    return null;
  }

  function readSplitStatus() {
    var assetStatus = callStatus(getAsset(), "getStatus", "status");
    var rendererStatus = callStatus(getRenderer(), "getStatus", "status");
    var landStatus = callStatus(getLand(), "getLandConstructStatus", "status");
    var surfaceStatus = callStatus(getSurface(), "getSurfaceMaterialStatus", "status");

    var landDetected = hasLand();
    var surfaceDetected = hasSurface();
    var rendererDetected = hasRenderer();
    var assetDetected = hasAsset();

    var responsibilitySplitActive = Boolean(
      landDetected && surfaceDetected ||
      assetStatus && assetStatus.responsibilitySplitActive ||
      rendererStatus && rendererStatus.responsibilitySplitActive
    );

    var rendererFacadeActive = Boolean(
      rendererDetected &&
      (!rendererStatus || rendererStatus.rendererFacadeActive !== false) &&
      (responsibilitySplitActive || rendererStatus && rendererStatus.B26_FACADE_TNT)
    );

    var assetModuleAwareConsumption = Boolean(
      assetStatus && assetStatus.assetModuleAwareConsumption ||
      assetDetected && responsibilitySplitActive
    );

    return {
      assetInstrumentDetected: assetDetected,
      rendererFacadeDetected: rendererDetected,
      landConstructsModuleDetected: landDetected,
      surfaceMaterialsModuleDetected: surfaceDetected,
      assetStatus: assetStatus,
      rendererStatus: rendererStatus,
      landConstructsStatus: landStatus,
      surfaceMaterialsStatus: surfaceStatus,
      responsibilitySplitActive: responsibilitySplitActive,
      rendererFacadeActive: rendererFacadeActive,
      assetModuleAwareConsumption: assetModuleAwareConsumption,
      splitRenderChainAware: true
    };
  }

  function refreshStatus(extra) {
    var split = readSplitStatus();

    Object.assign(status, {
      assetInstrumentDetected: split.assetInstrumentDetected,
      rendererFacadeDetected: split.rendererFacadeDetected,
      landConstructsModuleDetected: split.landConstructsModuleDetected,
      surfaceMaterialsModuleDetected: split.surfaceMaterialsModuleDetected,
      responsibilitySplitActive: split.responsibilitySplitActive,
      rendererFacadeActive: split.rendererFacadeActive,
      assetModuleAwareConsumption: split.assetModuleAwareConsumption,
      lastAssetStatus: split.assetStatus,
      lastRendererStatus: split.rendererStatus,
      lastLandConstructsStatus: split.landConstructsStatus,
      lastSurfaceMaterialsStatus: split.surfaceMaterialsStatus,
      splitRenderChainAware: true,
      boundaryUpdatedAt: now()
    }, extra || {});

    return split;
  }

  function makeSession(config) {
    var route = getRouteState();
    var cfg = Object.assign({
      realm: route.mode === "inspection" ? "showroom-planet-one-inspection-realm" : "showroom-parent-proof-realm",
      route: route.path,
      routeRole: route.mode === "inspection" ? "planet-one-inspection-room" : "showroom-proof-lobby",
      mode: route.mode
    }, config || {});

    var session = {
      sessionId: ["showroom", cfg.mode || "route", Date.now(), Math.random().toString(16).slice(2)].join("-"),
      mode: cfg.mode,
      realm: cfg.realm,
      route: cfg.route,
      routeRole: cfg.routeRole,
      createdAt: now(),
      phaseReceipts: [],
      phaseIndex: -1,
      phaseRotationClosed: false
    };

    sessions[session.sessionId] = session;

    refreshStatus({
      activeRealm: cfg.realm,
      activeRoute: cfg.route,
      activeRouteRole: cfg.routeRole,
      activeMode: cfg.mode,
      activeSessionId: session.sessionId
    });

    pushReceipt("runtime_session_created", {
      mode: cfg.mode,
      realm: cfg.realm,
      route: cfg.route,
      routeRole: cfg.routeRole,
      phaseSequence: PHASE_SEQUENCE,
      runtimeRole: "receipt-ledger-inspection-boundary-and-split-chain-observer",
      assetInstrumentAuthority: ASSET_PATH,
      rendererAuthority: RENDERER_PATH,
      landConstructsAuthority: LAND_PATH,
      surfaceMaterialsAuthority: SURFACE_PATH
    }, session);

    return session;
  }

  function closePhaseRotation(session) {
    var seen = session.phaseReceipts.map(function (item) {
      return item.phase;
    });

    var closed = PHASE_SEQUENCE.every(function (phase) {
      return seen.indexOf(phase) !== -1;
    });

    session.phaseRotationClosed = closed;
    status.phaseRotationClosed = closed;
    status.phaseRotationSessionId = session.sessionId;

    if (closed) {
      pushReceipt("phase_rotation_closed", {
        phaseSequence: PHASE_SEQUENCE,
        phasesSeen: seen,
        closeout: true
      }, session);
    }

    return closed;
  }

  function createRuntime(config) {
    var session = makeSession(config);

    function writeReceipt(type, payload) {
      refreshStatus();
      return pushReceipt(type, payload || {}, session);
    }

    function writePhaseReceipt(phase, payload) {
      var normalized = PHASE_SEQUENCE.indexOf(String(phase || "").toUpperCase()) !== -1
        ? String(phase).toUpperCase()
        : "UNSPECIFIED";

      var index = PHASE_SEQUENCE.indexOf(normalized);

      session.phaseIndex = index;
      session.phaseReceipts.push({
        phase: normalized,
        phaseIndex: index,
        payload: payload || {},
        timestamp: now()
      });

      pushReceipt("phase_receipt_written", {
        phase: normalized,
        phaseIndex: index,
        phaseSequence: PHASE_SEQUENCE,
        splitRenderChainStatus: readSplitStatus(),
        details: payload || {}
      }, session);

      closePhaseRotation(session);
    }

    function closeoutRoute(payload) {
      PHASE_SEQUENCE.forEach(function (phase, index) {
        var alreadySeen = session.phaseReceipts.some(function (item) {
          return item.phase === phase;
        });

        if (!alreadySeen) {
          writePhaseReceipt(phase, {
            closeoutGenerated: true,
            phaseIndex: index,
            route: session.route,
            realm: session.realm
          });
        }
      });

      return pushReceipt("route_phase_closeout_complete", {
        route: session.route,
        realm: session.realm,
        closed: closePhaseRotation(session),
        closeoutPayload: payload || {},
        splitRenderChainStatus: readSplitStatus()
      }, session);
    }

    return Object.freeze({
      version: VERSION,
      VERSION: VERSION,
      generation: GENERATION,
      gen4Type: GEN4_TYPE,
      authority: AUTHORITY,
      phaseSequence: PHASE_SEQUENCE.slice(),
      writeReceipt: writeReceipt,
      writePhaseReceipt: writePhaseReceipt,
      closeoutRoute: closeoutRoute,
      getReceipts: function () {
        return clone(receipts.filter(function (item) {
          return item.sessionId === session.sessionId;
        }));
      },
      getStatus: function () {
        refreshStatus();
        return clone({
          session: session,
          global: status
        });
      }
    });
  }

  function requestIdle(callback) {
    if (typeof global.requestIdleCallback === "function") {
      global.requestIdleCallback(callback, { timeout: 900 });
      return;
    }

    global.setTimeout(callback, 80);
  }

  function getMount(selector) {
    return global.document ? global.document.querySelector(selector || "#planet-one-render") : null;
  }

  function scriptMatches(script, path) {
    try {
      return new URL(script.src, global.location.origin).pathname === path;
    } catch (error) {
      return script.src && script.src.indexOf(path) !== -1;
    }
  }

  function findScript(path) {
    var scripts;
    var i;

    if (!global.document) return null;

    scripts = global.document.getElementsByTagName("script");
    for (i = 0; i < scripts.length; i += 1) {
      if (scripts[i].src && scriptMatches(scripts[i], path)) return scripts[i];
    }

    return null;
  }

  function waitFor(detector, timeoutMs) {
    var start = Date.now();

    return new Promise(function (resolve) {
      function tick() {
        if (!detector || detector()) {
          resolve(true);
          return;
        }

        if (Date.now() - start >= timeoutMs) {
          resolve(false);
          return;
        }

        global.setTimeout(tick, 40);
      }

      tick();
    });
  }

  function requestScript(key, path, detector, session) {
    var existing;
    var script;
    var target;

    if (!global.document) return Promise.resolve(false);
    if (detector && detector()) return Promise.resolve(true);
    if (scriptPromises[key]) return scriptPromises[key];

    existing = findScript(path);
    if (existing) {
      scriptPromises[key] = waitFor(detector, 2400).then(function (ok) {
        pushReceipt(ok ? "runtime_existing_script_detected" : "runtime_existing_script_pending", {
          key: key,
          path: path,
          detected: ok
        }, session || null);

        return ok;
      });

      return scriptPromises[key];
    }

    scriptPromises[key] = new Promise(function (resolve) {
      script = global.document.createElement("script");
      script.src = path;
      script.async = true;
      script.dataset.showroomRuntimeLoaded = "true";
      script.dataset.showroomRuntimeKey = key;

      script.onload = function () {
        waitFor(detector, 1600).then(function (ok) {
          pushReceipt(ok ? "runtime_script_loaded" : "runtime_script_loaded_but_global_pending", {
            key: key,
            path: path,
            detected: ok
          }, session || null);

          resolve(ok);
        });
      };

      script.onerror = function () {
        pushReceipt("runtime_script_failed", {
          key: key,
          path: path
        }, session || null);

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

  function callGlobalRenderer(method) {
    var renderer = getRenderer();

    if (!renderer || !method) return false;

    if (typeof renderer[method] === "function") {
      renderer[method]();
      return true;
    }

    if (method === "pause" && typeof renderer.stop === "function") {
      renderer.stop();
      return true;
    }

    if (method === "resume" && typeof renderer.start === "function") {
      renderer.start();
      return true;
    }

    return false;
  }

  function callHandle(handle, method) {
    if (!handle || !method) return false;

    if (typeof handle[method] === "function") {
      handle[method]();
      return true;
    }

    if (handle.handle && typeof handle.handle[method] === "function") {
      handle.handle[method]();
      return true;
    }

    if (handle.renderer && typeof handle.renderer[method] === "function") {
      handle.renderer[method]();
      return true;
    }

    return false;
  }

  function createInspectionBoundary(config) {
    var cfg = Object.assign({
      mountSelector: "#planet-one-render",
      parentRoute: "/showroom/",
      inspectionRoute: "/showroom/globe/",
      caption: "Planet 1 - Nine Summits Universe - split render chain inspection lane",
      lazyWhenVisible: true,
      autoOnInspectionRoute: true,
      intersectionThreshold: 0.22,
      preventDuplicateMounts: true
    }, config || {});

    var session = makeSession({
      realm: "showroom-inspection-boundary-realm",
      route: getRouteState().path,
      routeRole: "route-aware-asset-render-gate",
      mode: getRouteState().mode
    });

    var instrumentHandle = null;
    var assetLoaded = false;
    var renderLoaded = false;
    var renderPaused = true;
    var inspectionRequested = false;
    var mountVisible = false;
    var observer = null;
    var destroyed = false;

    function update(extra) {
      var route = getRouteState();

      refreshStatus(Object.assign({
        activeRoute: route.path,
        activeMode: route.mode,
        showroomLobbyMode: route.isParentShowroom,
        showroomInspectionMode: route.isInspectionRoute || inspectionRequested,
        inspectionActive: inspectionRequested || route.isInspectionRoute || route.isInspectionHash,
        assetLoaded: assetLoaded,
        renderLoaded: renderLoaded,
        renderPaused: renderPaused,
        renderMountVisible: mountVisible,
        splitRenderChainAware: true
      }, extra || {}));
    }

    function stopKnownLoops(reason) {
      var stopped = false;

      if (getRenderer() && typeof getRenderer().stopAll === "function") {
        getRenderer().stopAll();
        stopped = true;
      } else if (getRenderer() && typeof getRenderer().stop === "function") {
        getRenderer().stop();
        stopped = true;
      }

      if (stopped) {
        pushReceipt("known_renderer_loops_stopped", {
          reason: reason || "runtime-boundary"
        }, session);
      }

      return stopped;
    }

    function mountAsset(reason) {
      var mount = getMount(cfg.mountSelector);
      var asset = getAsset();
      var result;

      if (!mount) {
        pushReceipt("inspection_mount_missing", {
          reason: reason || "mount-asset",
          mountSelector: cfg.mountSelector
        }, session);

        return Promise.resolve(false);
      }

      if (!asset || typeof asset.renderGlobe !== "function") {
        pushReceipt("asset_instrument_unavailable", {
          reason: reason || "mount-asset",
          assetInstrumentPath: ASSET_PATH
        }, session);

        return Promise.resolve(false);
      }

      if (cfg.preventDuplicateMounts) {
        stopKnownLoops("before-asset-instrument-mount");
      }

      try {
        result = asset.renderGlobe(mount, {
          caption: cfg.caption,
          animate: true,
          rendererPath: RENDERER_PATH,
          landConstructsPath: LAND_PATH,
          surfaceMaterialsPath: SURFACE_PATH
        });
      } catch (error) {
        pushReceipt("asset_instrument_mount_failed", {
          reason: reason || "renderGlobe-threw",
          error: String(error && error.message ? error.message : error)
        }, session);

        return Promise.resolve(false);
      }

      instrumentHandle = result;
      assetLoaded = true;
      renderLoaded = true;
      renderPaused = false;

      mount.dataset.inspectionActive = "true";
      mount.dataset.runtimeBoundary = VERSION;
      mount.dataset.lazyRenderGate = "true";
      mount.dataset.singleRenderLoop = "true";
      mount.dataset.assetInstrumentPath = ASSET_PATH;
      mount.dataset.planetOneRenderer = RENDERER_PATH;
      mount.dataset.splitRenderChainAware = "true";

      update({
        lastInspectionReason: reason || "asset-instrument-mounted"
      });

      pushReceipt("showroom_asset_instrument_mounted", {
        reason: reason || "inspection-active",
        assetInstrumentPath: ASSET_PATH,
        rendererPath: RENDERER_PATH,
        landConstructsPath: LAND_PATH,
        surfaceMaterialsPath: SURFACE_PATH,
        runtimeDoesNotBypassAsset: true,
        result: clone(result)
      }, session);

      global.setTimeout(function () {
        update();
        pushReceipt("split_render_chain_observed", readSplitStatus(), session);
      }, 340);

      global.setTimeout(function () {
        update();
        pushReceipt("split_render_chain_observed_late", readSplitStatus(), session);
      }, 1250);

      return Promise.resolve(true);
    }

    function startRenderer(reason) {
      if (destroyed) return Promise.resolve(false);

      inspectionRequested = true;
      update({
        lastInspectionReason: reason || "start-renderer-via-asset"
      });

      if (renderLoaded && instrumentHandle) {
        callHandle(instrumentHandle, "start");
        callGlobalRenderer("start");

        renderPaused = false;

        update({
          renderPaused: false
        });

        pushReceipt("planet_one_renderer_resumed_via_asset_boundary", {
          reason: reason || "already-loaded",
          splitRenderChainStatus: readSplitStatus()
        }, session);

        return Promise.resolve(true);
      }

      return requestScript("asset-instrument", ASSET_PATH, hasAsset, session)
        .then(function (ok) {
          assetLoaded = ok;
          update({
            assetLoaded: ok
          });

          if (!ok) throw new Error("DGBShowroomGlobeInstrument.renderGlobe is unavailable.");

          return mountAsset(reason || "asset-instrument-activation");
        })
        .catch(function (error) {
          var mount = getMount(cfg.mountSelector);

          if (mount) {
            mount.innerHTML = "<div style=\"padding:18px;border:1px solid rgba(255,160,130,.32);border-radius:18px;color:rgba(255,230,220,.86);background:rgba(20,8,8,.62);font-weight:800;text-align:center;\">Planet 1 asset instrument could not load. Check /assets/showroom.globe.instrument.js and /showroom/runtime.js.</div>";
          }

          assetLoaded = false;
          renderLoaded = false;
          renderPaused = true;

          update({
            assetLoaded: false,
            renderLoaded: false,
            renderPaused: true,
            lastRuntimeError: String(error && error.message ? error.message : error)
          });

          pushReceipt("showroom_asset_instrument_mount_failed", {
            reason: reason || "asset-instrument-mount-failed",
            error: String(error && error.message ? error.message : error),
            assetInstrumentPath: ASSET_PATH
          }, session);

          return false;
        });
    }

    function pauseRenderer(reason) {
      var stopped = false;

      stopped = callHandle(instrumentHandle, "stop") || callHandle(instrumentHandle, "pause") || stopped;
      stopped = callGlobalRenderer("stop") || callGlobalRenderer("pause") || stopped;

      renderPaused = true;

      update({
        renderPaused: true,
        lastPauseReason: reason || "pause-renderer"
      });

      pushReceipt("planet_one_renderer_paused_by_runtime_boundary", {
        reason: reason || "pause-renderer",
        stopped: stopped,
        splitRenderChainStatus: readSplitStatus()
      }, session);

      return stopped;
    }

    function resumeRenderer(reason) {
      var started = false;

      if (!renderLoaded || !instrumentHandle) {
        startRenderer(reason || "resume-without-loaded-renderer");
        return false;
      }

      started = callHandle(instrumentHandle, "start") || callHandle(instrumentHandle, "resume") || started;
      started = callGlobalRenderer("start") || callGlobalRenderer("resume") || started;

      renderPaused = false;

      update({
        renderPaused: false,
        lastResumeReason: reason || "resume-renderer"
      });

      pushReceipt("planet_one_renderer_resumed_by_runtime_boundary", {
        reason: reason || "resume-renderer",
        started: started,
        splitRenderChainStatus: readSplitStatus()
      }, session);

      return started;
    }

    function scrollToInspection() {
      var mount = getMount(cfg.mountSelector);
      var target = mount || global.document.getElementById("globe-main") || global.document.getElementById("inspection-title");

      if (target && typeof target.scrollIntoView === "function") {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }

    function activateInspection(reason, shouldScroll) {
      inspectionRequested = true;

      update({
        inspectionActive: true,
        lastInspectionReason: reason || "activate-inspection"
      });

      pushReceipt("inspection_boundary_activated", {
        reason: reason || "activate-inspection",
        routeState: getRouteState(),
        assetInstrumentPath: ASSET_PATH,
        rendererPath: RENDERER_PATH,
        splitRenderChainAware: true
      }, session);

      if (shouldScroll) scrollToInspection();

      return startRenderer(reason || "activate-inspection");
    }

    function deactivateInspection(reason) {
      inspectionRequested = false;

      update({
        inspectionActive: false,
        lastInspectionReason: reason || "deactivate-inspection"
      });

      pauseRenderer(reason || "inspection-deactivated");

      pushReceipt("inspection_boundary_deactivated", {
        reason: reason || "deactivate-inspection",
        routeState: getRouteState(),
        splitRenderChainStatus: readSplitStatus()
      }, session);
    }

    function sameOriginUrl(href) {
      try {
        return new URL(href, global.location.origin);
      } catch (error) {
        return null;
      }
    }

    function handleClick(event) {
      var link = event.target && event.target.closest ? event.target.closest("a[href]") : null;
      var url;
      var targetPath;
      var route;
      var wantsInspection;
      var wantsLobby;

      if (!link) return;

      url = sameOriginUrl(link.getAttribute("href"));
      if (!url || url.origin !== global.location.origin) return;

      targetPath = normalizePath(url.pathname);
      route = getRouteState();

      wantsInspection = targetPath === cfg.inspectionRoute || INSPECTION_HASHES.indexOf(url.hash) !== -1;
      wantsLobby = targetPath === cfg.parentRoute && INSPECTION_HASHES.indexOf(url.hash) === -1;

      if (wantsInspection && getMount(cfg.mountSelector)) {
        event.preventDefault();

        if (global.history && global.history.pushState) {
          global.history.pushState(
            { showroomInspection: true },
            "",
            cfg.inspectionRoute + (url.hash || "#planet-one-render")
          );
        }

        activateInspection("inspect-link-click", true);
        return;
      }

      if (wantsLobby && getMount(cfg.mountSelector) && (route.isInspectionRoute || inspectionRequested)) {
        event.preventDefault();

        if (global.history && global.history.pushState) {
          global.history.pushState({ showroomLobby: true }, "", cfg.parentRoute);
        }

        deactivateInspection("return-to-lobby-link-click");
        global.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    }

    function handlePopState() {
      var route = getRouteState();

      if (route.isInspectionRoute || route.isInspectionHash) {
        activateInspection("history-inspection", false);
        return;
      }

      if (route.isParentShowroom) {
        deactivateInspection("history-lobby");
      }
    }

    function handleVisibilityChange() {
      if (global.document.hidden) {
        pauseRenderer("document-hidden");
        return;
      }

      if (
        getRouteState().isInspectionRoute ||
        getRouteState().isInspectionHash ||
        inspectionRequested ||
        mountVisible
      ) {
        resumeRenderer("document-visible");
      }
    }

    function setupObserver() {
      var mount = getMount(cfg.mountSelector);

      if (!mount || typeof global.IntersectionObserver !== "function") return;

      observer = new global.IntersectionObserver(function (entries) {
        var entry = entries[0];
        var route = getRouteState();

        mountVisible = Boolean(
          entry &&
          entry.isIntersecting &&
          entry.intersectionRatio >= cfg.intersectionThreshold
        );

        update({
          renderMountVisible: mountVisible
        });

        if (mountVisible) {
          if (cfg.lazyWhenVisible && (inspectionRequested || route.isInspectionRoute || route.isInspectionHash)) {
            activateInspection("inspection-visible", false);
          } else if (renderLoaded && inspectionRequested) {
            resumeRenderer("inspection-visible-loaded");
          }

          return;
        }

        if (renderLoaded) {
          pauseRenderer("inspection-offscreen");
        }
      }, {
        threshold: [0, cfg.intersectionThreshold, 0.5, 0.9]
      });

      observer.observe(mount);
    }

    function init() {
      var route = getRouteState();

      update({
        activeRoute: route.path,
        activeMode: route.mode,
        inspectionActive: route.isInspectionRoute || route.isInspectionHash
      });

      pushReceipt("inspection_boundary_initialized", {
        routeState: route,
        assetInstrumentPath: ASSET_PATH,
        rendererPath: RENDERER_PATH,
        landConstructsPath: LAND_PATH,
        surfaceMaterialsPath: SURFACE_PATH,
        showroomLobbyMode: true,
        showroomInspectionMode: true,
        lazyRenderGate: true,
        singleRenderLoop: true,
        pauseRenderWhenHidden: true,
        pauseRenderWhenOffscreen: true,
        splitRenderChainAware: true
      }, session);

      global.document.addEventListener("click", handleClick);
      global.addEventListener("popstate", handlePopState);
      global.document.addEventListener("visibilitychange", handleVisibilityChange);

      setupObserver();

      if (route.isParentShowroom && !route.isInspectionHash) {
        stopKnownLoops("parent-lobby-load");
        pauseRenderer("parent-lobby-load");
      }

      if (cfg.autoOnInspectionRoute && (route.isInspectionRoute || route.isInspectionHash)) {
        requestIdle(function () {
          activateInspection("initial-inspection-route", false);
        });
      }
    }

    function destroy() {
      destroyed = true;

      global.document.removeEventListener("click", handleClick);
      global.removeEventListener("popstate", handlePopState);
      global.document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (observer) {
        observer.disconnect();
        observer = null;
      }

      pauseRenderer("boundary-destroyed");

      pushReceipt("inspection_boundary_destroyed", {
        assetLoaded: assetLoaded,
        renderLoaded: renderLoaded,
        rendererPaused: renderPaused,
        splitRenderChainStatus: readSplitStatus()
      }, session);
    }

    init();

    return Object.freeze({
      version: VERSION,
      VERSION: VERSION,
      authority: AUTHORITY,
      assetInstrumentPath: ASSET_PATH,
      rendererPath: RENDERER_PATH,
      landConstructsPath: LAND_PATH,
      surfaceMaterialsPath: SURFACE_PATH,
      activateInspection: activateInspection,
      deactivateInspection: deactivateInspection,
      startRenderer: startRenderer,
      startAssetInstrument: startRenderer,
      pauseRenderer: pauseRenderer,
      resumeRenderer: resumeRenderer,
      destroy: destroy,
      getStatus: function () {
        update();

        return clone({
          session: session,
          routeState: getRouteState(),
          assetLoaded: assetLoaded,
          renderLoaded: renderLoaded,
          renderPaused: renderPaused,
          inspectionRequested: inspectionRequested,
          mountVisible: mountVisible,
          splitRenderChainStatus: readSplitStatus(),
          global: status
        });
      }
    });
  }

  function autoAttachBoundary() {
    var route;
    var hasMount;
    var page;
    var family;

    if (!global.document) return null;

    if (
      global.__DGBShowroomRuntimeBoundary &&
      typeof global.__DGBShowroomRuntimeBoundary.destroy === "function"
    ) {
      global.__DGBShowroomRuntimeBoundary.destroy();
    }

    route = getRouteState();
    hasMount = Boolean(getMount("#planet-one-render"));
    page = global.document.documentElement ? global.document.documentElement.dataset.page : "";

    family =
      route.isParentShowroom ||
      route.isInspectionRoute ||
      hasMount ||
      page === "showroom" ||
      page === "showroom-globe";

    if (!family) return null;

    global.__DGBShowroomRuntimeBoundary = createInspectionBoundary();

    pushReceipt("inspection_boundary_auto_attached", {
      routeState: route,
      hasMount: hasMount,
      autoAttached: true,
      assetInstrumentPath: ASSET_PATH,
      rendererPath: RENDERER_PATH,
      splitRenderChainAware: true
    }, null);

    return global.__DGBShowroomRuntimeBoundary;
  }

  var api = Object.freeze({
    VERSION: VERSION,
    version: VERSION,
    PREVIOUS_VERSION: PREVIOUS_VERSION,
    GENERATION: GENERATION,
    GEN4_TYPE: GEN4_TYPE,
    AUTHORITY: AUTHORITY,
    ASSET_INSTRUMENT_PATH: ASSET_PATH,
    RENDERER_PATH: RENDERER_PATH,
    LAND_CONSTRUCTS_PATH: LAND_PATH,
    SURFACE_MATERIALS_PATH: SURFACE_PATH,
    PHASE_SEQUENCE: PHASE_SEQUENCE,
    CONTRACT_MARKERS: CONTRACT_MARKERS.slice(),
    markers: CONTRACT_MARKERS.slice(),
    createRuntime: createRuntime,
    createInspectionBoundary: createInspectionBoundary,
    attachInspectionBoundary: createInspectionBoundary,
    getRouteState: function () {
      return clone(getRouteState());
    },
    getSplitRenderChainStatus: function () {
      refreshStatus();
      return clone(readSplitStatus());
    },
    getGlobalStatus: function () {
      refreshStatus();
      return clone(status);
    },
    getGlobalReceipts: function () {
      return clone(receipts);
    },
    destroyAutoBoundary: function () {
      if (
        global.__DGBShowroomRuntimeBoundary &&
        typeof global.__DGBShowroomRuntimeBoundary.destroy === "function"
      ) {
        global.__DGBShowroomRuntimeBoundary.destroy();
      }

      global.__DGBShowroomRuntimeBoundary = null;
    }
  });

  global.ShowroomRuntime = api;
  global.DGBShowroomRuntime = api;

  if (global.document) {
    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", autoAttachBoundary, { once: true });
    } else {
      autoAttachBoundary();
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
