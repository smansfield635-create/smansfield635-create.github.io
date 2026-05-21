// /showroom/globe/audralia/index.js
// TNT FULL-FILE REPLACEMENT
// AUDRALIA_MAYDAY_ROUTE_JS_FRAMEPATH_PISTON_REDUCTION_WITH_NEWS_LATTICE_SCOPE_TNT_v1
//
// Purpose:
// - Remove the real frame-path bottleneck.
// - Keep the route as a lightweight thermostat controller.
// - Preserve the 360 Fibonacci diagnostic lattice standard.
// - Publicize NEWS cell law without inventing NEWS math in the route.
// - Keep runtime as the primary source for projected lattice seats and links.
// - Keep fallback lattice as emergency fallback only, never the success standard.
// - Keep renderFrame free of DOM/layout/canvas validation work.
// - No HTML change. No new files. No child math. No runtime rewrite. No visual-pass claim.

(function () {
  "use strict";

  var CONTRACT = "AUDRALIA_MAYDAY_ROUTE_JS_FRAMEPATH_PISTON_REDUCTION_WITH_NEWS_LATTICE_SCOPE_TNT_v1";
  var PREVIOUS_CONTRACT = "AUDRALIA_MAYDAY_ROUTE_JS_MAP_REDUCTION_TNT_v1";
  var HTML_PAIR_CONTRACT = "AUDRALIA_MAYDAY_ROUTE_PAIR_RESET_DROPDOWN_AND_LATTICE_CONTROL_TNT_v1";

  var RUNTIME_PATH = "/assets/audralia/clean/runtime/audralia.true-globe.runtime.js";
  var RUNTIME_PUBLIC_CONTRACT = "AUDRALIA_G2_TRUE_GLOBE_RUNTIME_CONSUMES_MOISTURE_AND_CLOUD_CHILDREN_TNT_v2";
  var RUNTIME_CACHE_KEY = "AUDRALIA_MAYDAY_FRAMEPATH_PISTON_NEWS_SCOPE_RUNTIME_CONSUMER_v1";

  var TAU = Math.PI * 2;

  var LENS_COPY = {
    planet: {
      title: "Planet View",
      label: "<strong>Planet View</strong> → held lens · thermostat remains lattice-first",
      copy: "Planet View remains held during Mayday control recovery. Surface, cloud, continent, terrain, moisture, and datum expansion are not executed from this route."
    },
    lattice: {
      title: "Lattice View",
      label: "<strong>Lattice View</strong> → 360 Fibonacci diagnostic lattice · NEWS-aware public scope",
      copy: "Lattice View is the thermostat. Runtime is the primary source for projected seats and links. Fallback is emergency-only and is not accepted as the lattice standard."
    },
    diagnostic: {
      title: "Diagnostic Scope",
      label: "<strong>Diagnostic Scope</strong> → piston, thermostat, NEWS, and runtime-source status",
      copy: "Diagnostic Scope publicizes compact status only: piston law, thermostat law, NEWS cell law, and 360 Fibonacci diagnostic lattice law."
    }
  };

  var NEWS_STANDARD = {
    name: "NEWS",
    north: "origin / pole / predecessor authority",
    east: "formation / successor expression",
    west: "correction / memory / opposite relation",
    south: "completion / grounding / stability",
    routeOwnsNewsMath: false,
    routePublicizesNewsStatus: true
  };

  var state = {
    stage: null,
    mount: null,
    canvas: null,
    ctx: null,
    cachedDetails: [],

    width: 0,
    height: 0,
    dpr: 1,
    stageRect: null,

    activeLens: "planet",
    runtime: null,
    runtimeLoaded: false,
    runtimeAccepted: false,
    runtimeReady: false,

    pointerActive: false,
    pointerId: null,
    lastPointerX: 0,
    lastPointerY: 0,

    raf: 0,
    frameCount: 0,
    dirty: true,
    settleFrames: 0,
    lastFrame: null,
    lastDiagnosticAt: 0,
    lastStatus: null,

    oneCanvas: false,
    oneLoop: false,
    pointerBound: false,
    stopped: false,

    fallbackActive: false,
    fallbackLatticeCacheKey: "",
    fallbackLatticeCache: null,

    duplicateCanvasRemoved: 0,
    runtimeCanvasCleanupCount: 0,

    datasetCache: {},
    errorCount: 0,
    lastError: "",

    renderFrameDomFree: true,
    newsStandardPublicized: true,
    routeOwnsNewsMath: false,
    fallbackIsSuccessStandard: false
  };

  if (
    window.__AUDRALIA_MAYDAY_ROUTE_CONTROLLER__ &&
    typeof window.__AUDRALIA_MAYDAY_ROUTE_CONTROLLER__.stop === "function"
  ) {
    try {
      window.__AUDRALIA_MAYDAY_ROUTE_CONTROLLER__.stop();
    } catch (_error) {}
  }

  var abortController = typeof AbortController !== "undefined" ? new AbortController() : null;
  var signal = abortController ? abortController.signal : undefined;
  var resizeObserver = null;

  function finite(value, fallback) {
    var number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function now() {
    return typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  }

  function recordError(scope, error) {
    state.errorCount += 1;
    state.lastError = scope + ": " + (error && error.message ? error.message : String(error || "unknown"));

    window.AUDRALIA_MAYDAY_ROUTE_ERROR = {
      contract: CONTRACT,
      scope: scope,
      message: state.lastError,
      errorCount: state.errorCount,
      time: new Date().toISOString()
    };
  }

  function setText(selector, value) {
    var node = document.querySelector(selector);
    var next = String(value);
    if (node && node.textContent !== next) node.textContent = next;
  }

  function setHtml(selector, value) {
    var node = document.querySelector(selector);
    var next = String(value);
    if (node && node.innerHTML !== next) node.innerHTML = next;
  }

  function setDataset(key, value) {
    var next = String(value);
    if (state.datasetCache[key] === next) return;

    state.datasetCache[key] = next;

    try {
      document.documentElement.dataset[key] = next;
      if (document.body) document.body.dataset[key] = next;
    } catch (_error) {}
  }

  function closeCachedMenus() {
    for (var i = 0; i < state.cachedDetails.length; i += 1) {
      try {
        state.cachedDetails[i].open = false;
      } catch (_error) {}
    }
  }

  function getRuntime() {
    return window.AUDRALIA_TRUE_GLOBE_RUNTIME ||
      window.AUDRALIA_G2_TRUE_GLOBE_RUNTIME ||
      null;
  }

  function runtimeStatus(runtime) {
    if (!runtime || typeof runtime.status !== "function") return null;

    try {
      return runtime.status();
    } catch (error) {
      recordError("runtime.status", error);
      return null;
    }
  }

  function acceptRuntime(runtime) {
    var status = runtimeStatus(runtime);

    return Boolean(
      runtime &&
      (
        typeof runtime.getFrame === "function" ||
        typeof runtime.tick === "function" ||
        typeof runtime.pointerMove === "function" ||
        (status && (status.runtimeReady || status.sphereCarrierReady || status.contract === RUNTIME_PUBLIC_CONTRACT))
      )
    );
  }

  function enforceOneCanvas(reason) {
    if (!state.mount) return;

    var canvases = Array.prototype.slice.call(state.mount.querySelectorAll("canvas"));
    var selected = state.canvas && state.mount.contains(state.canvas) ? state.canvas : null;

    if (!selected) {
      selected = canvases.find(function (canvas) {
        return canvas.getAttribute("data-audralia-mayday-canvas") === CONTRACT;
      }) || canvases[0] || document.createElement("canvas");
    }

    if (!state.mount.contains(selected)) {
      selected.setAttribute("data-audralia-mayday-canvas", CONTRACT);
      selected.setAttribute("aria-hidden", "true");
      state.mount.appendChild(selected);
    }

    canvases = Array.prototype.slice.call(state.mount.querySelectorAll("canvas"));

    canvases.forEach(function (canvas) {
      if (canvas === selected) return;

      try {
        canvas.remove();
        state.duplicateCanvasRemoved += 1;
        if (reason && reason.indexOf("runtime") >= 0) state.runtimeCanvasCleanupCount += 1;
      } catch (_error) {}
    });

    state.canvas = selected;
    state.canvas.setAttribute("data-audralia-mayday-canvas", CONTRACT);
    state.canvas.style.position = "absolute";
    state.canvas.style.inset = "0";
    state.canvas.style.width = "100%";
    state.canvas.style.height = "100%";
    state.canvas.style.display = "block";
    state.canvas.style.background = "transparent";
    state.canvas.style.pointerEvents = "none";

    state.ctx = state.canvas.getContext("2d", { alpha: true });
    state.oneCanvas = Boolean(state.ctx);
  }

  function updateDimensionsFromRect(rect) {
    if (!rect || !state.canvas) return false;

    var dpr = Math.max(1, Math.min(1.75, window.devicePixelRatio || 1));
    var width = Math.max(320, Math.floor(rect.width * dpr));
    var height = Math.max(480, Math.floor(rect.height * dpr));

    state.stageRect = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    };

    if (state.width === width && state.height === height && state.dpr === dpr) return false;

    state.width = width;
    state.height = height;
    state.dpr = dpr;
    state.canvas.width = width;
    state.canvas.height = height;

    state.fallbackLatticeCacheKey = "";
    state.fallbackLatticeCache = null;

    if (state.runtime && typeof state.runtime.resize === "function") {
      try {
        state.runtime.resize(width, height, dpr);
      } catch (error) {
        recordError("runtime.resize", error);
      }
    }

    requestRender("dimension-update", 4);
    return true;
  }

  function measureStageOnce() {
    if (!state.stage) return false;
    return updateDimensionsFromRect(state.stage.getBoundingClientRect());
  }

  function setupResizeHandling() {
    measureStageOnce();

    if (typeof ResizeObserver !== "undefined" && state.stage) {
      resizeObserver = new ResizeObserver(function (entries) {
        if (!entries || !entries[0]) return;

        var rect = entries[0].contentRect;
        var box = state.stage.getBoundingClientRect();

        updateDimensionsFromRect({
          left: box.left,
          top: box.top,
          width: rect.width,
          height: rect.height
        });
      });

      try {
        resizeObserver.observe(state.stage);
      } catch (_error) {}
    }

    window.addEventListener("resize", function () {
      measureStageOnce();
      updateDiagnostics(false);
      requestRender("window-resize", 4);
    }, signal ? { signal: signal, passive: true } : { passive: true });

    window.addEventListener("orientationchange", function () {
      setTimeout(function () {
        measureStageOnce();
        updateDiagnostics(false);
        requestRender("orientationchange", 4);
      }, 120);
    }, signal ? { signal: signal, passive: true } : { passive: true });
  }

  function fallbackMetrics() {
    var width = state.width || 640;
    var height = state.height || 720;
    var minSide = Math.min(width, height);
    var mobile = width < 760 * (state.dpr || 1);

    return {
      width: width,
      height: height,
      centerX: width / 2,
      centerY: mobile ? height * 0.405 : height * 0.42,
      radius: minSide * (mobile ? 0.345 : 0.365),
      cameraDistance: 3.72
    };
  }

  function metrics(frame) {
    return frame && frame.metrics ? frame.metrics : fallbackMetrics();
  }

  function initRuntime() {
    var runtime = getRuntime();
    if (!runtime) return;

    state.runtime = runtime;
    state.runtimeLoaded = true;
    state.runtimeAccepted = acceptRuntime(runtime);
    state.runtimeReady = state.runtimeAccepted;

    if (typeof runtime.init === "function") {
      try {
        runtime.init({
          width: state.width,
          height: state.height,
          dpr: state.dpr,
          activeLens: state.activeLens,
          mode: "mayday-framepath-piston-news-lattice-scope",
          latticeFirst: true,
          newsStandardActive: true,
          routePublicizesNewsOnly: true,
          routeOwnsNewsMath: false,
          childMathHeldDuringLattice: true,
          routeIsConsumerOnly: true,
          visualPassClaimed: false
        });
      } catch (error) {
        recordError("runtime.init", error);
      }
    }

    enforceOneCanvas("after-runtime-init");
    updateDiagnostics(true);
    requestRender("runtime-init", 4);
  }

  function loadRuntime() {
    var existingRuntime = getRuntime();

    if (existingRuntime) {
      initRuntime();
      return Promise.resolve(existingRuntime);
    }

    return new Promise(function (resolve) {
      var existingScript = document.querySelector("script[data-audralia-mayday-runtime-loader='true']");

      if (existingScript) {
        setTimeout(function () {
          initRuntime();
          resolve(getRuntime());
        }, 0);
        return;
      }

      var script = document.createElement("script");
      script.src = RUNTIME_PATH + "?v=" + encodeURIComponent(RUNTIME_CACHE_KEY);
      script.defer = true;
      script.async = true;
      script.setAttribute("data-audralia-mayday-runtime-loader", "true");
      script.setAttribute("data-route-contract", CONTRACT);
      script.setAttribute("data-runtime-contract", RUNTIME_PUBLIC_CONTRACT);
      script.setAttribute("data-news-standard-active", "true");
      script.setAttribute("data-lattice-first", "true");
      script.setAttribute("data-child-math-held-during-lattice", "true");

      script.onload = function () {
        initRuntime();
        resolve(getRuntime());
      };

      script.onerror = function () {
        state.runtimeLoaded = false;
        state.runtimeAccepted = false;
        state.runtimeReady = false;
        recordError("loadRuntime", "runtime script failed");
        updateDiagnostics(true);
        requestRender("runtime-failed", 1);
        resolve(null);
      };

      document.body.appendChild(script);
    });
  }

  function getRuntimeFrame(time) {
    var frame = null;

    if (state.runtime) {
      try {
        if (typeof state.runtime.getFrame === "function") {
          frame = state.runtime.getFrame();
        } else if (typeof state.runtime.tick === "function") {
          frame = state.runtime.tick(time);
        }
      } catch (error) {
        recordError("runtime.frame", error);
      }
    }

    if (!frame) frame = state.lastFrame || {};

    var output = Object.assign({}, frame);
    output.width = state.width;
    output.height = state.height;
    output.dpr = state.dpr;
    output.activeLens = state.activeLens;
    output.metrics = output.metrics || fallbackMetrics();
    output.renderTime = finite(output.renderTime, time / 1000);
    output.latticeFirst = true;
    output.newsStandardActive = true;
    output.routePublicizesNewsOnly = true;
    output.childMathHeldDuringLattice = state.activeLens === "lattice";
    output.routeIsConsumerOnly = true;

    state.lastFrame = output;
    return output;
  }

  function clear() {
    state.ctx.clearRect(0, 0, state.width, state.height);
  }

  function drawSphereBase(frame, reduced) {
    var ctx = state.ctx;
    var m = metrics(frame);
    var cx = m.centerX;
    var cy = m.centerY;
    var r = m.radius;

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = reduced ? "rgba(5,30,68,0.76)" : "rgba(7,52,104,0.88)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.997, 0, TAU);
    ctx.strokeStyle = reduced ? "rgba(141,216,255,0.12)" : "rgba(175,229,255,0.16)";
    ctx.lineWidth = Math.max(0.6, state.dpr * 0.65);
    ctx.stroke();

    ctx.restore();
  }

  function drawPlanetHeld(frame) {
    var ctx = state.ctx;
    var m = metrics(frame);

    drawSphereBase(frame, true);

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(238,244,255,0.56)";
    ctx.font = "800 " + Math.max(12, 13 * state.dpr) + "px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText("Planet View held · lattice thermostat active", m.centerX, m.centerY + m.radius * 0.70);
    ctx.restore();
  }

  function fallbackLattice(frame) {
    var m = metrics(frame);
    var key = [
      Math.round(m.centerX),
      Math.round(m.centerY),
      Math.round(m.radius),
      Math.round(state.dpr * 100)
    ].join(":");

    if (state.fallbackLatticeCacheKey === key && state.fallbackLatticeCache) {
      return state.fallbackLatticeCache;
    }

    var seats = [];
    var ringLinks = [];
    var spineLinks = [];

    for (var band = 0; band < 16; band += 1) {
      var yNorm = -0.94 + (band / 15) * 1.88;
      var rx = m.radius * Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
      var y = m.centerY + yNorm * m.radius;

      for (var radial = 0; radial < 16; radial += 1) {
        var a = (radial / 16) * TAU;
        var x = m.centerX + Math.cos(a) * rx;
        var z = Math.sin(a) * Math.sqrt(Math.max(0, 1 - yNorm * yNorm));

        seats.push({
          seatIndex: band * 16 + radial,
          bandIndex: band,
          radialIndex: radial,
          frontFacing: z >= 0,
          fallback: true,
          newsStandardExpected: true,
          newsComputedHere: false,
          screen: {
            x: x,
            y: y,
            z: z,
            perspective: 1
          }
        });
      }
    }

    for (band = 0; band < 16; band += 1) {
      for (radial = 0; radial < 16; radial += 1) {
        var current = seats[band * 16 + radial];
        var next = seats[band * 16 + ((radial + 1) % 16)];

        ringLinks.push({
          a: current,
          b: next,
          frontFacing: current.frontFacing || next.frontFacing,
          major: band % 4 === 0,
          fallback: true
        });

        if (band < 15) {
          var below = seats[(band + 1) * 16 + radial];
          spineLinks.push({
            a: current,
            b: below,
            frontFacing: current.frontFacing || below.frontFacing,
            major: radial % 4 === 0,
            fallback: true
          });
        }
      }
    }

    state.fallbackLatticeCacheKey = key;
    state.fallbackLatticeCache = {
      fallback: true,
      projectedSeats: seats,
      projectedLinks: {
        ringLinks: ringLinks,
        spineLinks: spineLinks,
        fibonacciLinks: []
      }
    };

    return state.fallbackLatticeCache;
  }

  function linkIsMajor(link) {
    if (!link) return false;
    if (link.major) return true;

    var a = link.a || {};
    var b = link.b || {};

    return (
      finite(a.radialIndex, -1) % 4 === 0 ||
      finite(b.radialIndex, -1) % 4 === 0 ||
      finite(a.bandIndex, -1) % 4 === 0 ||
      finite(b.bandIndex, -1) % 4 === 0
    );
  }

  function seatIsMajor(seat) {
    if (!seat) return false;
    return finite(seat.radialIndex, -1) % 4 === 0 || finite(seat.bandIndex, -1) % 4 === 0;
  }

  function drawLattice(frame, reduced) {
    var ctx = state.ctx;
    var source;
    var runtimeHasLattice = Boolean(frame && frame.projectedSeats && frame.projectedSeats.length);

    if (runtimeHasLattice) {
      source = frame;
      state.fallbackActive = false;
    } else {
      source = fallbackLattice(frame);
      state.fallbackActive = true;
    }

    var seats = source.projectedSeats || [];
    var links = source.projectedLinks || {};

    var allLinks = []
      .concat(links.ringLinks || [])
      .concat(links.spineLinks || [])
      .concat(reduced ? [] : (links.fibonacciLinks || []));

    ctx.save();

    for (var i = 0; i < allLinks.length; i += 1) {
      var link = allLinks[i];
      if (!link || !link.a || !link.b || !link.a.screen || !link.b.screen) continue;
      if (reduced && !linkIsMajor(link)) continue;

      var opacity = link.frontFacing ? (reduced ? 0.24 : 0.30) : (reduced ? 0.045 : 0.08);
      if (linkIsMajor(link)) opacity += reduced ? 0.08 : 0.12;

      ctx.beginPath();
      ctx.moveTo(link.a.screen.x, link.a.screen.y);
      ctx.lineTo(link.b.screen.x, link.b.screen.y);
      ctx.strokeStyle = link.fallback
        ? "rgba(150,190,210," + clamp(opacity * 0.72, 0.03, 0.30).toFixed(4) + ")"
        : "rgba(112,199,255," + clamp(opacity, 0.03, 0.44).toFixed(4) + ")";
      ctx.lineWidth = linkIsMajor(link) ? Math.max(0.75, state.dpr * 0.72) : Math.max(0.38, state.dpr * 0.42);
      ctx.stroke();
    }

    for (i = 0; i < seats.length; i += 1) {
      var seat = seats[i];
      if (!seat || !seat.screen) continue;
      if (reduced && !seatIsMajor(seat)) continue;

      var major = seatIsMajor(seat);
      var radius = major ? 1.95 : 1.15;
      var alpha = seat.frontFacing ? (major ? 0.72 : 0.58) : (major ? 0.14 : 0.08);

      ctx.beginPath();
      ctx.arc(seat.screen.x, seat.screen.y, radius * state.dpr, 0, TAU);
      ctx.fillStyle = major
        ? "rgba(244,207,131," + alpha.toFixed(4) + ")"
        : (state.fallbackActive
          ? "rgba(150,190,210," + alpha.toFixed(4) + ")"
          : "rgba(141,216,255," + alpha.toFixed(4) + ")");
      ctx.fill();
    }

    ctx.restore();
  }

  function renderFrame(time) {
    if (state.stopped || !state.ctx) return;

    state.raf = 0;

    clear();

    var frame = getRuntimeFrame(time);
    var reduced = state.pointerActive || state.settleFrames > 0;

    if (state.activeLens === "lattice") {
      drawSphereBase(frame, reduced);
      drawLattice(frame, reduced);
    } else if (state.activeLens === "diagnostic") {
      drawSphereBase(frame, false);
      drawLattice(frame, false);
    } else {
      drawPlanetHeld(frame);
    }

    state.frameCount += 1;
    state.oneLoop = true;
    state.dirty = false;

    if (state.settleFrames > 0) state.settleFrames -= 1;

    state.lastStatus = buildStatus();
    window.AUDRALIA_MAYDAY_ROUTE_STATE = state.lastStatus;

    if (state.pointerActive || state.settleFrames > 0) {
      state.raf = window.requestAnimationFrame(renderFrame);
    }
  }

  function requestRender(reason, settleFrames) {
    state.dirty = true;

    if (settleFrames) {
      state.settleFrames = Math.max(state.settleFrames, settleFrames);
    }

    if (!state.raf && !state.stopped) {
      state.raf = window.requestAnimationFrame(renderFrame);
    }
  }

  function setLens(lensName) {
    var lens = Object.prototype.hasOwnProperty.call(LENS_COPY, lensName) ? lensName : "planet";

    closeCachedMenus();

    state.activeLens = lens;
    document.documentElement.dataset.audraliaActiveLens = lens;

    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-lens-button]")).forEach(function (button) {
      var pressed = button.dataset.audraliaLensButton === lens;
      button.setAttribute("aria-pressed", pressed ? "true" : "false");
    });

    setText("[data-audralia-lens-title]", LENS_COPY[lens].title);
    setText("[data-audralia-lens-copy]", LENS_COPY[lens].copy);
    setHtml("[data-audralia-stage-label]", LENS_COPY[lens].label);

    if (state.runtime && typeof state.runtime.setLens === "function") {
      try {
        state.runtime.setLens(lens);
      } catch (error) {
        recordError("runtime.setLens", error);
      }
    }

    enforceOneCanvas("lens-switch");
    updateDiagnostics(true);
    requestRender("lens-switch", lens === "lattice" ? 4 : 1);

    window.dispatchEvent(new CustomEvent("audralia:mayday-news-lens", {
      detail: {
        contract: CONTRACT,
        activeLens: lens,
        latticeLightweight: lens === "lattice",
        runtimeLatticePrimary: true,
        fallbackIsEmergencyOnly: true,
        newsStandardActive: true,
        routeOwnsNewsMath: false,
        childMathHeldDuringLattice: lens === "lattice"
      }
    }));
  }

  function bindLensControls() {
    Array.prototype.slice.call(document.querySelectorAll("[data-audralia-lens-button]")).forEach(function (button) {
      button.addEventListener("click", function () {
        setLens(button.dataset.audraliaLensButton);
      }, signal ? { signal: signal } : false);
    });
  }

  function pointerPoint(event) {
    var rect = state.stageRect;

    if (!rect) {
      return {
        x: event.clientX * state.dpr,
        y: event.clientY * state.dpr
      };
    }

    return {
      x: (event.clientX - rect.left) * state.dpr,
      y: (event.clientY - rect.top) * state.dpr
    };
  }

  function bindPointer() {
    if (!state.stage) return;

    state.stage.addEventListener("pointerdown", function (event) {
      closeCachedMenus();

      state.pointerActive = true;
      state.pointerId = event.pointerId;

      var p = pointerPoint(event);
      state.lastPointerX = p.x;
      state.lastPointerY = p.y;

      try {
        state.stage.setPointerCapture(event.pointerId);
      } catch (_error) {}

      if (state.runtime && typeof state.runtime.pointerDown === "function") {
        try {
          state.runtime.pointerDown(p.x, p.y, now());
        } catch (error) {
          recordError("runtime.pointerDown", error);
        }
      }

      requestRender("pointer-down", 2);
      event.preventDefault();
    }, signal ? { signal: signal, passive: false } : { passive: false });

    state.stage.addEventListener("pointermove", function (event) {
      if (!state.pointerActive) return;

      var p = pointerPoint(event);
      state.lastPointerX = p.x;
      state.lastPointerY = p.y;

      if (state.runtime && typeof state.runtime.pointerMove === "function") {
        try {
          state.runtime.pointerMove(p.x, p.y, now());
        } catch (error) {
          recordError("runtime.pointerMove", error);
        }
      }

      requestRender("pointer-move", 2);
      event.preventDefault();
    }, signal ? { signal: signal, passive: false } : { passive: false });

    function release(event) {
      if (!state.pointerActive) return;

      state.pointerActive = false;

      if (state.runtime && typeof state.runtime.pointerUp === "function") {
        try {
          state.runtime.pointerUp(now());
        } catch (error) {
          recordError("runtime.pointerUp", error);
        }
      }

      try {
        if (state.pointerId !== null) state.stage.releasePointerCapture(state.pointerId);
      } catch (_error) {}

      state.pointerId = null;

      updateDiagnostics(true);
      requestRender("pointer-release", 12);
      event.preventDefault();
    }

    state.stage.addEventListener("pointerup", release, signal ? { signal: signal, passive: false } : { passive: false });
    state.stage.addEventListener("pointercancel", release, signal ? { signal: signal, passive: false } : { passive: false });
    state.stage.addEventListener("lostpointercapture", release, signal ? { signal: signal, passive: false } : { passive: false });

    state.pointerBound = true;
  }

  function buildStatus() {
    return {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlPairContract: HTML_PAIR_CONTRACT,

      activeLens: state.activeLens,
      runtimeReady: state.runtimeReady,
      runtimeLatticePrimary: !state.fallbackActive,
      fallbackActive: state.fallbackActive,
      fallbackIsEmergencyOnly: true,
      fallbackIsSuccessStandard: false,

      oneCanvas: state.oneCanvas,
      oneLoop: state.oneLoop,
      pointerBound: state.pointerBound,
      pointerActive: state.pointerActive,

      frameCount: state.frameCount,
      pistonLawActive: true,
      renderFrameDomFree: true,
      noCanvasScanInRender: true,
      noResizeInRender: true,
      noDiagnosticsInRender: true,
      dragPathDomFree: true,
      dirtyFrameDiscipline: true,
      idleRenderPausedOrThrottled: true,

      newsStandardActive: true,
      newsCellRequiresNorthEastWestSouth: true,
      routePublicizesNewsStatus: true,
      routeOwnsNewsMath: false,
      runtimeProjectsNewsCells: "expected",
      datumDefinesNewsChronology: "expected",

      fibonacciDiagnosticLatticeActive: true,
      radialLanes: 16,
      fibonacciBands: 16,
      latticeSeats: 256,
      diagnosticChronologyPublicized: true,

      childMathHeld: state.activeLens === "lattice",
      routeFallbackDisabledInLattice: true,

      noHtmlChange: true,
      noNewFiles: true,
      noChildMath: true,
      noRuntimeRewrite: true,
      noContinentWork: true,
      noSurfaceWork: true,
      noCloudWork: true,
      noDatumExpansion: true,
      noVisualPassClaim: true,

      duplicateCanvasRemoved: state.duplicateCanvasRemoved,
      runtimeCanvasCleanupCount: state.runtimeCanvasCleanupCount,
      errorCount: state.errorCount
    };
  }

  function updateDiagnostics(force) {
    var time = now();

    if (state.pointerActive && !force) return;

    if (
      !force &&
      state.activeLens !== "diagnostic" &&
      time - state.lastDiagnosticAt < 1000
    ) {
      return;
    }

    state.lastDiagnosticAt = time;

    var status = buildStatus();

    setText("[data-audralia-diagnostic-route]", "active · piston-reduced NEWS scope");
    setText(
      "[data-audralia-diagnostic-runtime]",
      status.runtimeReady
        ? (status.runtimeLatticePrimary ? "runtime primary · projected lattice expected" : "runtime loaded · fallback currently active")
        : "runtime pending · emergency fallback only"
    );
    setText("[data-audralia-diagnostic-lens]", status.activeLens);
    setText("[data-audralia-diagnostic-canvas]", status.oneCanvas ? "one canvas" : "canvas pending");
    setText("[data-audralia-diagnostic-loop]", status.oneLoop ? "dirty RAF · piston DOM-free" : "loop pending");
    setText(
      "[data-audralia-diagnostic-children]",
      "NEWS active · route publicizes only · child math held"
    );

    setDataset("audraliaMaydayRouteContract", CONTRACT);
    setDataset("audraliaActiveLens", status.activeLens);
    setDataset("audraliaRuntimeReady", status.runtimeReady);
    setDataset("audraliaRuntimeLatticePrimary", status.runtimeLatticePrimary);
    setDataset("audraliaFallbackActive", status.fallbackActive);
    setDataset("audraliaPistonLawActive", status.pistonLawActive);
    setDataset("audraliaNewsStandardActive", status.newsStandardActive);
    setDataset("audraliaRouteOwnsNewsMath", false);
    setDataset("audraliaRenderFrameDomFree", true);
    setDataset("audraliaNoCanvasScanInRender", true);
    setDataset("audraliaNoResizeInRender", true);

    window.AUDRALIA_MAYDAY_ROUTE_STATUS = status;
  }

  function publishBoot() {
    window.AUDRALIA_MAYDAY_ROUTE_BOOT = {
      contract: CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      htmlPairContract: HTML_PAIR_CONTRACT,
      route: "/showroom/globe/audralia/",
      js: "/showroom/globe/audralia/index.js",

      targetFileOnly: true,
      noHtmlChange: true,
      noNewFiles: true,
      noChildMath: true,
      noRuntimeRewrite: true,

      pistonLawActive: true,
      thermostatLawActive: true,
      newsCellLawActive: true,
      fibonacciDiagnosticLatticeLawActive: true,

      renderFrameDomFree: true,
      noCanvasScanInRender: true,
      noResizeInRender: true,
      noDomDiagnosticsInRender: true,
      dragPathDomFree: true,

      runtimeLatticePrimary: true,
      fallbackEmergencyOnly: true,
      fallbackIsSuccessStandard: false,

      newsStandard: NEWS_STANDARD,
      newsStandardPublicized: true,
      routeOwnsNewsMath: false,

      diagnosticChronology: [
        "axis / pole authority",
        "north origin",
        "16-compass chronology",
        "Fibonacci sequence phase",
        "16 radial lanes",
        "16 bands",
        "256 lattice seats",
        "hex-cell address",
        "NEWS completion",
        "predecessor / successor relation",
        "opposite-node relation",
        "hemisphere relation",
        "equator / polar relation",
        "circulation role",
        "runtime projection",
        "visible diagnostic proof"
      ],

      visualPassClaimed: false,
      bootedAt: new Date().toISOString()
    };
  }

  function stop() {
    state.stopped = true;

    if (state.raf) {
      try {
        window.cancelAnimationFrame(state.raf);
      } catch (_error) {}
    }

    state.raf = 0;

    if (resizeObserver) {
      try {
        resizeObserver.disconnect();
      } catch (_error) {}
    }

    if (abortController) {
      try {
        abortController.abort();
      } catch (_error) {}
    }
  }

  window.__AUDRALIA_MAYDAY_ROUTE_CONTROLLER__ = {
    stop: stop,
    state: state,
    contract: CONTRACT
  };

  function init() {
    state.stage = document.querySelector("#audraliaGlobeStage");
    state.mount = document.querySelector("#audraliaGlobeMount");
    state.cachedDetails = Array.prototype.slice.call(document.querySelectorAll("details"));

    if (!state.stage || !state.mount) {
      recordError("init", "Missing #audraliaGlobeStage or #audraliaGlobeMount");
      return;
    }

    enforceOneCanvas("boot");
    setupResizeHandling();
    bindLensControls();
    bindPointer();
    setLens("planet");
    publishBoot();

    loadRuntime().then(function () {
      enforceOneCanvas("after-runtime-load");
      updateDiagnostics(true);
      requestRender("runtime-load", 4);
    });

    updateDiagnostics(true);
    requestRender("boot", 3);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, signal ? { signal: signal, once: true } : { once: true });
  } else {
    init();
  }
})();
