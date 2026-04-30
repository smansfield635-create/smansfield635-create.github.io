Destination file:

/showroom/runtime.js

(function attachShowroomRuntime(global) {
  "use strict";

  const VERSION = "SHOWROOM_RUNTIME_INSPECTION_BOUNDARY_AND_LAZY_RENDER_TNT_v1";
  const PREVIOUS_VERSION = "SHOWROOM_RUNTIME_TRUE_GEN4_PHASE_ROTATION_CLOSEOUT_TNT_v1";
  const GENERATION = "GENERATION_4";
  const GEN4_TYPE = "narrative-code";
  const AUTHORITY = "/showroom/runtime.js";
  const RENDERER_PATH = "/world/render/planet-one.render.js";

  /*
    SHOWROOM_RUNTIME_INSPECTION_BOUNDARY_AND_LAZY_RENDER_TNT_v1

    Runtime law:
    /showroom/ may contain the Planet 1 section as part of the same scroll experience.
    /showroom/ must not automatically run the heavy Planet 1 renderer on page load.
    /showroom/globe/ is the inspection route and may activate the renderer.
    Clicking Inspect Planet may move the visitor to the Planet 1 section on the same screen.
    The runtime owns the activation boundary, not the renderer itself.

    Required markers:
    showroom-lobby-mode=true
    showroom-inspection-mode=true
    lazy-render-gate=true
    inspection-boundary-active=true
    single-render-loop=true
    pause-render-when-hidden=true
    pause-render-when-offscreen=true
    planet-one-renderer=/world/render/planet-one.render.js
  */

  const PHASE_SEQUENCE = Object.freeze([
    "HOME",
    "BOUNDARY",
    "MOTION",
    "REALM",
    "RECEIPT",
    "NEXT"
  ]);

  const INSPECTION_HASHES = Object.freeze([
    "#planet-one-render",
    "#globe-main",
    "#inspection-title",
    "#planet-one-inspection"
  ]);

  const store = {
    createdAt: new Date().toISOString(),
    receipts: [],
    routeSessions: {},
    status: {
      generation: GENERATION,
      gen4Type: GEN4_TYPE,
      runtimeAuthority: AUTHORITY,
      previousVersion: PREVIOUS_VERSION,
      receiptLedger: true,
      ownsMotion: false,
      ownsSpeed: false,
      ownsPlacement: false,
      ownsRenderer: false,
      ownsRenderBoundary: true,
      phaseSequence: PHASE_SEQUENCE.join(" → "),
      activeRealm: null,
      activeRoute: null,
      activeRouteRole: null,
      activeMode: null,
      activeSessionId: null,
      lastReceiptType: null,
      lastReceiptAt: null,
      phaseRotationClosed: false,
      showroomLobbyMode: true,
      showroomInspectionMode: true,
      lazyRenderGate: true,
      inspectionBoundaryActive: true,
      singleRenderLoop: true,
      pauseRenderWhenHidden: true,
      pauseRenderWhenOffscreen: true,
      planetOneRenderer: RENDERER_PATH,
      inspectionActive: false,
      renderLoaded: false,
      renderPaused: true,
      renderMountVisible: false,
      runtimeVersion: VERSION
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function now() {
    return new Date().toISOString();
  }

  function normalizePhase(phase) {
    const candidate = String(phase || "").toUpperCase();
    return PHASE_SEQUENCE.includes(candidate) ? candidate : "UNSPECIFIED";
  }

  function normalizePath(pathname) {
    const raw = String(pathname || "/");
    if (raw === "/") return "/";
    return raw.endsWith("/") ? raw : raw + "/";
  }

  function getRouteState(pathname, hash) {
    const path = normalizePath(pathname || global.location.pathname);
    const currentHash = typeof hash === "string" ? hash : global.location.hash;

    const isParentShowroom = path === "/showroom/";
    const isInspectionRoute = path === "/showroom/globe/";
    const isInspectionHash = INSPECTION_HASHES.includes(currentHash);

    return {
      path,
      hash: currentHash,
      isParentShowroom,
      isInspectionRoute,
      isInspectionHash,
      mode: isInspectionRoute || isInspectionHash ? "inspection" : isParentShowroom ? "lobby" : "external"
    };
  }

  function publish(type, receipt) {
    global.dispatchEvent(
      new CustomEvent("showroom:runtime-receipt", {
        detail: clone(receipt)
      })
    );

    global.dispatchEvent(
      new CustomEvent("showroom:true-gen4-ledger", {
        detail: {
          type,
          generation: GENERATION,
          gen4Type: GEN4_TYPE,
          receipt: clone(receipt),
          status: clone(store.status)
        }
      })
    );
  }

  function pushReceipt(type, payload, session) {
    const routeState = getRouteState();

    const receipt = {
      type,
      generation: GENERATION,
      gen4Type: GEN4_TYPE,
      runtimeAuthority: AUTHORITY,
      runtimeVersion: VERSION,
      ownsMotion: false,
      ownsSpeed: false,
      ownsPlacement: false,
      ownsRenderer: false,
      ownsRenderBoundary: true,
      sessionId: session ? session.sessionId : null,
      route: session ? session.route : routeState.path,
      realm: session ? session.realm : null,
      routeRole: session ? session.routeRole : routeState.mode,
      payload: payload || {},
      timestamp: now()
    };

    store.receipts.push(receipt);

    if (store.receipts.length > 144) {
      store.receipts.splice(0, store.receipts.length - 144);
    }

    store.status.lastReceiptType = type;
    store.status.lastReceiptAt = receipt.timestamp;
    store.status.activeRoute = receipt.route;
    store.status.activeRouteRole = receipt.routeRole;
    store.status.activeMode = routeState.mode;
    store.status.updatedAt = receipt.timestamp;

    publish(type, receipt);

    return clone(receipt);
  }

  function createSession(config) {
    const routeState = getRouteState();

    const cfg = Object.assign(
      {
        realm: routeState.mode === "inspection"
          ? "showroom-planet-one-inspection-realm"
          : "showroom-parent-proof-realm",
        route: routeState.path,
        routeRole: routeState.mode === "inspection"
          ? "planet-one-inspection-room"
          : "showroom-proof-lobby",
        mode: routeState.mode
      },
      config || {}
    );

    const sessionId = [
      "showroom",
      cfg.mode || "route",
      Date.now(),
      Math.random().toString(16).slice(2)
    ].join("-");

    const session = {
      sessionId,
      mode: cfg.mode,
      realm: cfg.realm,
      route: cfg.route,
      routeRole: cfg.routeRole,
      createdAt: now(),
      phaseReceipts: [],
      phaseIndex: -1,
      phaseRotationClosed: false
    };

    store.routeSessions[sessionId] = session;

    store.status.activeRealm = cfg.realm;
    store.status.activeRoute = cfg.route;
    store.status.activeRouteRole = cfg.routeRole;
    store.status.activeMode = cfg.mode;
    store.status.activeSessionId = sessionId;
    store.status.updatedAt = now();

    pushReceipt(
      "runtime_session_created",
      {
        mode: cfg.mode,
        realm: cfg.realm,
        route: cfg.route,
        routeRole: cfg.routeRole,
        phaseSequence: PHASE_SEQUENCE,
        runtimeRole: "receipt-ledger-and-inspection-boundary",
        motionAuthority: "renderer-owned",
        speedAuthority: "renderer-owned",
        placementAuthority: "route-consumer",
        rendererAuthority: RENDERER_PATH
      },
      session
    );

    return session;
  }

  function closePhaseRotation(session) {
    const phasesSeen = session.phaseReceipts.map(function phaseKey(item) {
      return item.phase;
    });

    const closed = PHASE_SEQUENCE.every(function required(phase) {
      return phasesSeen.includes(phase);
    });

    session.phaseRotationClosed = closed;
    store.status.phaseRotationClosed = closed;
    store.status.phaseRotationSessionId = session.sessionId;

    if (closed) {
      pushReceipt(
        "phase_rotation_closed",
        {
          phaseSequence: PHASE_SEQUENCE,
          phasesSeen,
          meaning:
            "The route has recorded the full True Gen 4 phase rotation from HOME through NEXT.",
          closeout: true
        },
        session
      );
    }

    return closed;
  }

  function createRuntime(config) {
    const session = createSession(config);

    function writeReceipt(type, payload) {
      return pushReceipt(type, payload || {}, session);
    }

    function writePhaseReceipt(phase, payload) {
      const normalized = normalizePhase(phase);
      const index = PHASE_SEQUENCE.indexOf(normalized);

      const phaseReceipt = {
        phase: normalized,
        phaseIndex: index,
        payload: payload || {},
        timestamp: now()
      };

      session.phaseIndex = index;
      session.phaseReceipts.push(phaseReceipt);

      const receipt = pushReceipt(
        "phase_receipt_written",
        {
          phase: normalized,
          phaseIndex: index,
          phaseSequence: PHASE_SEQUENCE,
          consequence:
            normalized === "UNSPECIFIED"
              ? "Unspecified phase recorded without closing the rotation."
              : "Phase recorded into the True Gen 4 narrative-code ledger.",
          details: payload || {}
        },
        session
      );

      closePhaseRotation(session);

      return receipt;
    }

    function closeoutRoute(payload) {
      PHASE_SEQUENCE.forEach(function recordPhase(phase, index) {
        const alreadySeen = session.phaseReceipts.some(function seen(item) {
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

      const closed = closePhaseRotation(session);

      return pushReceipt(
        "route_phase_closeout_complete",
        {
          route: session.route,
          realm: session.realm,
          routeRole: session.routeRole,
          mode: session.mode,
          closed,
          closeoutPayload: payload || {},
          phaseSequence: PHASE_SEQUENCE,
          runtimeRole: "receipt-ledger-and-inspection-boundary"
        },
        session
      );
    }

    function getReceipts() {
      return clone(
        store.receipts.filter(function bySession(receipt) {
          return receipt.sessionId === session.sessionId;
        })
      );
    }

    function getStatus() {
      return clone({
        session,
        global: store.status
      });
    }

    return Object.freeze({
      version: VERSION,
      generation: GENERATION,
      gen4Type: GEN4_TYPE,
      authority: AUTHORITY,
      phaseSequence: PHASE_SEQUENCE.slice(),
      config: clone(config || {}),
      writeReceipt,
      writePhaseReceipt,
      closeoutRoute,
      getReceipts,
      getStatus
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
    return document.querySelector(selector || "#planet-one-render");
  }

  function stopKnownRendererLoops(reason) {
    if (
      global.DGBPlanetOneRenderTeam &&
      typeof global.DGBPlanetOneRenderTeam.stopAll === "function"
    ) {
      global.DGBPlanetOneRenderTeam.stopAll();
      pushReceipt("known_renderer_loops_stopped", { reason: reason || "runtime-boundary" }, null);
    }
  }

  function callRenderHandle(handle, method) {
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
    const cfg = Object.assign(
      {
        mountSelector: "#planet-one-render",
        parentRoute: "/showroom/",
        inspectionRoute: "/showroom/globe/",
        rendererPath: RENDERER_PATH,
        caption: "Planet 1 · Nine Summits Universe · inspection render lane",
        lazyWhenVisible: true,
        autoOnInspectionRoute: true,
        intersectionThreshold: 0.22,
        preventDuplicateMounts: true
      },
      config || {}
    );

    const session = createSession({
      realm: "showroom-inspection-boundary-realm",
      route: getRouteState().path,
      routeRole: "route-aware-render-gate",
      mode: getRouteState().mode
    });

    let scriptPromise = null;
    let scriptLoaded = Boolean(global.DGBPlanetOneRenderTeam);
    let renderLoaded = false;
    let renderPaused = true;
    let renderHandle = null;
    let inspectionRequested = false;
    let mountVisible = false;
    let observer = null;
    let destroyed = false;

    function updateBoundaryStatus(extra) {
      const routeState = getRouteState();

      Object.assign(store.status, {
        activeRoute: routeState.path,
        activeMode: routeState.mode,
        showroomLobbyMode: routeState.isParentShowroom,
        showroomInspectionMode: routeState.isInspectionRoute || inspectionRequested,
        inspectionActive: inspectionRequested || routeState.isInspectionRoute || routeState.isInspectionHash,
        renderLoaded,
        renderPaused,
        renderMountVisible: mountVisible,
        planetOneRenderer: cfg.rendererPath,
        boundaryUpdatedAt: now()
      }, extra || {});
    }

    function loadRendererScript() {
      if (global.DGBPlanetOneRenderTeam) {
        scriptLoaded = true;
        return Promise.resolve();
      }

      if (scriptPromise) return scriptPromise;

      const existing = Array.from(document.scripts).find(function findScript(script) {
        return script.src && new URL(script.src, global.location.origin).pathname === cfg.rendererPath;
      });

      if (existing) {
        scriptPromise = new Promise(function waitExisting(resolve, reject) {
          if (global.DGBPlanetOneRenderTeam) {
            scriptLoaded = true;
            resolve();
            return;
          }

          existing.addEventListener("load", function onLoad() {
            scriptLoaded = true;
            resolve();
          }, { once: true });

          existing.addEventListener("error", function onError() {
            reject(new Error("Existing Planet 1 renderer script failed."));
          }, { once: true });

          global.setTimeout(function checkLateGlobal() {
            if (global.DGBPlanetOneRenderTeam) {
              scriptLoaded = true;
              resolve();
            }
          }, 60);
        });

        return scriptPromise;
      }

      scriptPromise = new Promise(function loadNew(resolve, reject) {
        const script = document.createElement("script");
        script.src = cfg.rendererPath;
        script.async = true;
        script.dataset.showroomRuntimeLoaded = "true";

        script.onload = function onLoad() {
          scriptLoaded = true;
          pushReceipt(
            "planet_one_renderer_script_loaded",
            {
              rendererPath: cfg.rendererPath,
              lazyLoaded: true,
              lazyRenderGate: true
            },
            session
          );
          resolve();
        };

        script.onerror = function onError() {
          pushReceipt(
            "planet_one_renderer_script_failed",
            {
              rendererPath: cfg.rendererPath,
              lazyLoaded: true
            },
            session
          );
          reject(new Error("Planet 1 renderer failed to load."));
        };

        document.body.appendChild(script);
      });

      return scriptPromise;
    }

    function scrollToInspection() {
      const mount = getMount(cfg.mountSelector);
      const target =
        mount ||
        document.getElementById("globe-main") ||
        document.getElementById("inspection-title");

      if (!target) return;

      target.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    function startRenderer(reason) {
      if (destroyed) return Promise.resolve(false);

      const mount = getMount(cfg.mountSelector);

      if (!mount) {
        pushReceipt(
          "inspection_mount_missing",
          {
            reason: reason || "start-renderer",
            mountSelector: cfg.mountSelector
          },
          session
        );
        return Promise.resolve(false);
      }

      inspectionRequested = true;
      updateBoundaryStatus({
        lastInspectionReason: reason || "start-renderer"
      });

      if (renderLoaded && renderHandle) {
        callRenderHandle(renderHandle, "start");
        renderPaused = false;
        updateBoundaryStatus({ renderPaused });
        pushReceipt(
          "planet_one_renderer_resumed",
          {
            reason: reason || "already-loaded",
            duplicateMountPrevented: true
          },
          session
        );
        return Promise.resolve(true);
      }

      return loadRendererScript().then(function afterScript() {
        if (
          !global.DGBPlanetOneRenderTeam ||
          typeof global.DGBPlanetOneRenderTeam.renderPlanetOne !== "function"
        ) {
          throw new Error("DGBPlanetOneRenderTeam.renderPlanetOne is unavailable.");
        }

        if (cfg.preventDuplicateMounts) {
          stopKnownRendererLoops("before-single-render-mount");
        }

        renderHandle = global.DGBPlanetOneRenderTeam.renderPlanetOne(mount, {
          caption: cfg.caption
        });

        renderLoaded = true;
        renderPaused = false;

        mount.dataset.inspectionActive = "true";
        mount.dataset.runtimeBoundary = VERSION;
        mount.dataset.lazyRenderGate = "true";
        mount.dataset.singleRenderLoop = "true";
        mount.dataset.planetOneRenderer = cfg.rendererPath;

        updateBoundaryStatus({
          renderLoaded,
          renderPaused,
          lastInspectionReason: reason || "renderer-mounted"
        });

        pushReceipt(
          "planet_one_renderer_mounted",
          {
            reason: reason || "inspection-active",
            rendererPath: cfg.rendererPath,
            singleRenderLoop: true,
            lazyRenderGate: true,
            inspectionBoundaryActive: true
          },
          session
        );

        return true;
      }).catch(function onError(error) {
        const mountAgain = getMount(cfg.mountSelector);

        if (mountAgain) {
          mountAgain.innerHTML =
            '<div class="render-waiting">Planet 1 renderer could not load. Check /world/render/planet-one.render.js.</div>';
        }

        renderLoaded = false;
        renderPaused = true;

        updateBoundaryStatus({
          renderLoaded,
          renderPaused,
          lastRendererError: String(error && error.message ? error.message : error)
        });

        pushReceipt(
          "planet_one_renderer_mount_failed",
          {
            reason: reason || "mount-failed",
            error: String(error && error.message ? error.message : error)
          },
          session
        );

        return false;
      });
    }

    function pauseRenderer(reason) {
      if (!renderLoaded || !renderHandle) {
        renderPaused = true;
        updateBoundaryStatus({ renderPaused });
        return false;
      }

      const stopped =
        callRenderHandle(renderHandle, "stop") ||
        callRenderHandle(renderHandle, "pause");

      renderPaused = true;

      updateBoundaryStatus({
        renderPaused,
        lastPauseReason: reason || "pause-renderer"
      });

      pushReceipt(
        "planet_one_renderer_paused",
        {
          reason: reason || "pause-renderer",
          stopped
        },
        session
      );

      return stopped;
    }

    function resumeRenderer(reason) {
      if (!renderLoaded || !renderHandle) {
        startRenderer(reason || "resume-without-loaded-renderer");
        return false;
      }

      const started =
        callRenderHandle(renderHandle, "start") ||
        callRenderHandle(renderHandle, "resume");

      renderPaused = false;

      updateBoundaryStatus({
        renderPaused,
        lastResumeReason: reason || "resume-renderer"
      });

      pushReceipt(
        "planet_one_renderer_resumed",
        {
          reason: reason || "resume-renderer",
          started
        },
        session
      );

      return started;
    }

    function activateInspection(reason, shouldScroll) {
      inspectionRequested = true;

      updateBoundaryStatus({
        inspectionActive: true,
        lastInspectionReason: reason || "activate-inspection"
      });

      pushReceipt(
        "inspection_boundary_activated",
        {
          reason: reason || "activate-inspection",
          routeState: getRouteState(),
          rendererPath: cfg.rendererPath
        },
        session
      );

      if (shouldScroll) {
        scrollToInspection();
      }

      return startRenderer(reason || "activate-inspection");
    }

    function deactivateInspection(reason) {
      inspectionRequested = false;

      updateBoundaryStatus({
        inspectionActive: false,
        lastInspectionReason: reason || "deactivate-inspection"
      });

      pauseRenderer(reason || "inspection-deactivated");

      pushReceipt(
        "inspection_boundary_deactivated",
        {
          reason: reason || "deactivate-inspection",
          routeState: getRouteState()
        },
        session
      );
    }

    function sameOriginUrl(href) {
      try {
        return new URL(href, global.location.origin);
      } catch (error) {
        return null;
      }
    }

    function handleClick(event) {
      const link = event.target && event.target.closest
        ? event.target.closest("a[href]")
        : null;

      if (!link) return;

      const url = sameOriginUrl(link.getAttribute("href"));
      if (!url || url.origin !== global.location.origin) return;

      const targetPath = normalizePath(url.pathname);
      const currentState = getRouteState();
      const hasInspectionMount = Boolean(getMount(cfg.mountSelector));

      const wantsInspection =
        targetPath === cfg.inspectionRoute ||
        INSPECTION_HASHES.includes(url.hash);

      const wantsLobby =
        targetPath === cfg.parentRoute &&
        !INSPECTION_HASHES.includes(url.hash);

      if (wantsInspection && hasInspectionMount) {
        event.preventDefault();

        const nextUrl =
          cfg.inspectionRoute + (url.hash || "#planet-one-render");

        if (global.history && global.history.pushState) {
          global.history.pushState(
            { showroomInspection: true },
            "",
            nextUrl
          );
        }

        activateInspection("inspect-link-click", true);
        return;
      }

      if (wantsLobby && hasInspectionMount && (currentState.isInspectionRoute || inspectionRequested)) {
        event.preventDefault();

        if (global.history && global.history.pushState) {
          global.history.pushState(
            { showroomLobby: true },
            "",
            cfg.parentRoute
          );
        }

        deactivateInspection("return-to-lobby-link-click");
        global.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    }

    function handlePopState() {
      const routeState = getRouteState();

      if (routeState.isInspectionRoute || routeState.isInspectionHash) {
        activateInspection("history-inspection", false);
        return;
      }

      if (routeState.isParentShowroom) {
        deactivateInspection("history-lobby");
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        pauseRenderer("document-hidden");
        return;
      }

      const routeState = getRouteState();

      if (routeState.isInspectionRoute || routeState.isInspectionHash || inspectionRequested || mountVisible) {
        resumeRenderer("document-visible");
      }
    }

    function setupIntersectionObserver() {
      const mount = getMount(cfg.mountSelector);
      if (!mount || typeof IntersectionObserver !== "function") return;

      observer = new IntersectionObserver(
        function observe(entries) {
          const entry = entries[0];
          mountVisible = Boolean(entry && entry.isIntersecting && entry.intersectionRatio >= cfg.intersectionThreshold);

          updateBoundaryStatus({
            renderMountVisible: mountVisible
          });

          if (mountVisible) {
            const routeState = getRouteState();

            if (
              cfg.lazyWhenVisible &&
              (inspectionRequested || routeState.isInspectionRoute || routeState.isInspectionHash)
            ) {
              activateInspection("inspection-visible", false);
            } else if (renderLoaded && inspectionRequested) {
              resumeRenderer("inspection-visible-loaded");
            }

            return;
          }

          if (renderLoaded) {
            pauseRenderer("inspection-offscreen");
          }
        },
        {
          threshold: [0, cfg.intersectionThreshold, 0.5, 0.9]
        }
      );

      observer.observe(mount);
    }

    function init() {
      const routeState = getRouteState();

      updateBoundaryStatus({
        activeRoute: routeState.path,
        activeMode: routeState.mode,
        inspectionActive: routeState.isInspectionRoute || routeState.isInspectionHash
      });

      pushReceipt(
        "inspection_boundary_initialized",
        {
          routeState,
          rendererPath: cfg.rendererPath,
          showroomLobbyMode: true,
          showroomInspectionMode: true,
          lazyRenderGate: true,
          singleRenderLoop: true,
          pauseRenderWhenHidden: true,
          pauseRenderWhenOffscreen: true
        },
        session
      );

      document.addEventListener("click", handleClick);
      global.addEventListener("popstate", handlePopState);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      setupIntersectionObserver();

      if (routeState.isParentShowroom && !routeState.isInspectionHash) {
        stopKnownRendererLoops("parent-lobby-load");
        pauseRenderer("parent-lobby-load");
      }

      if (cfg.autoOnInspectionRoute && (routeState.isInspectionRoute || routeState.isInspectionHash)) {
        requestIdle(function activateOnIdle() {
          activateInspection("initial-inspection-route", false);
        });
      }
    }

    function destroy() {
      destroyed = true;
      document.removeEventListener("click", handleClick);
      global.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (observer) {
        observer.disconnect();
        observer = null;
      }

      pauseRenderer("boundary-destroyed");

      pushReceipt(
        "inspection_boundary_destroyed",
        {
          rendererLoaded: renderLoaded,
          rendererPaused: renderPaused
        },
        session
      );
    }

    init();

    return Object.freeze({
      version: VERSION,
      authority: AUTHORITY,
      rendererPath: cfg.rendererPath,
      activateInspection,
      deactivateInspection,
      startRenderer,
      pauseRenderer,
      resumeRenderer,
      destroy,
      getStatus: function getStatus() {
        return clone({
          session,
          routeState: getRouteState(),
          renderLoaded,
          renderPaused,
          inspectionRequested,
          mountVisible,
          global: store.status
        });
      }
    });
  }

  function autoAttachBoundary() {
    if (global.__DGBShowroomRuntimeBoundary && typeof global.__DGBShowroomRuntimeBoundary.destroy === "function") {
      global.__DGBShowroomRuntimeBoundary.destroy();
    }

    const routeState = getRouteState();
    const hasMount = Boolean(getMount("#planet-one-render"));
    const isShowroomFamily =
      routeState.isParentShowroom ||
      routeState.isInspectionRoute ||
      hasMount ||
      document.documentElement.dataset.page === "showroom" ||
      document.documentElement.dataset.page === "showroom-globe";

    if (!isShowroomFamily) return null;

    global.__DGBShowroomRuntimeBoundary = createInspectionBoundary();

    pushReceipt(
      "inspection_boundary_auto_attached",
      {
        routeState,
        hasMount,
        autoAttached: true
      },
      null
    );

    return global.__DGBShowroomRuntimeBoundary;
  }

  global.ShowroomRuntime = Object.freeze({
    VERSION,
    GENERATION,
    GEN4_TYPE,
    AUTHORITY,
    RENDERER_PATH,
    PHASE_SEQUENCE,
    createRuntime,
    createInspectionBoundary,
    attachInspectionBoundary: createInspectionBoundary,
    getRouteState: function getCurrentRouteState() {
      return clone(getRouteState());
    },
    getGlobalStatus: function getGlobalStatus() {
      return clone(store.status);
    },
    getGlobalReceipts: function getGlobalReceipts() {
      return clone(store.receipts);
    },
    destroyAutoBoundary: function destroyAutoBoundary() {
      if (global.__DGBShowroomRuntimeBoundary && typeof global.__DGBShowroomRuntimeBoundary.destroy === "function") {
        global.__DGBShowroomRuntimeBoundary.destroy();
      }

      global.__DGBShowroomRuntimeBoundary = null;
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoAttachBoundary, { once: true });
  } else {
    autoAttachBoundary();
  }
})(window);
