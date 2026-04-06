(function () {
  "use strict";

  var APP = {
    NAME: "INDEX_EUCLIDEAN_UNIVERSE_V1",
    VERSION: "1.0.0",
    START_TS: Date.now(),
    state: "BOOTING",
    errors: [],
    warnings: [],
    raf: 0,
    root: null,
    canvas: null,
    hud: null,
    ctx: null,
    width: 0,
    height: 0,
    dpr: 1,
    cx: 0,
    cy: 0,
    stars: [],
    orbitBands: [],
    planets: [],
    universeReady: false
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (e) {
      return "";
    }
  }

  function pushError(label, message) {
    APP.errors.push({
      label: String(label || "unknown"),
      message: String(message || "unknown")
    });
  }

  function pushWarning(message) {
    APP.warnings.push(String(message || "unknown"));
  }

  function log(level, message, extra) {
    var payload = {
      t: nowIso(),
      app: APP.NAME,
      level: level,
      message: message
    };

    if (extra && typeof extra === "object") {
      payload.extra = extra;
    }

    try {
      if (level === "error") {
        console.error(payload);
      } else if (level === "warn") {
        console.warn(payload);
      } else {
        console.log(payload);
      }
    } catch (e) {}
  }

  function safeRun(label, fn, fallback) {
    try {
      return fn();
    } catch (error) {
      pushError(label, error && error.message ? error.message : String(error));
      log("error", label + " failed", {
        error: error && error.stack ? String(error.stack) : String(error)
      });
      return fallback;
    }
  }

  function clamp(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function ensureBody() {
    return safeRun("ensureBody", function () {
      if (document.body) return document.body;
      var body = document.createElement("body");
      document.documentElement.appendChild(body);
      return body;
    }, null);
  }

  function ensureRoot() {
    return safeRun("ensureRoot", function () {
      var body = ensureBody();
      var root = null;

      if (!body) {
        throw new Error("document.body unavailable");
      }

      root =
        document.getElementById("app") ||
        document.getElementById("root") ||
        document.querySelector("[data-app-root]");

      if (!root) {
        root = document.createElement("div");
        root.id = "app";
        root.setAttribute("data-app-root", "true");
        body.appendChild(root);
        pushWarning("No app root found; created #app.");
      }

      root.style.position = "relative";
      root.style.width = "100%";
      root.style.minHeight = "100vh";
      root.style.overflow = "hidden";
      root.style.background = "#020611";

      return root;
    }, null);
  }

  function ensureCanvas(root) {
    return safeRun("ensureCanvas", function () {
      var canvas = null;

      if (!root) {
        throw new Error("root unavailable");
      }

      canvas =
        document.getElementById("scene") ||
        document.getElementById("canvas") ||
        root.querySelector("canvas");

      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "scene";
        canvas.setAttribute("aria-label", "Euclidean universe display");
        root.appendChild(canvas);
      }

      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.display = "block";
      canvas.style.zIndex = "0";
      canvas.style.background = "#020611";

      return canvas;
    }, null);
  }

  function ensureHud(root) {
    return safeRun("ensureHud", function () {
      var hud = document.getElementById("boot-status");

      if (!root) {
        throw new Error("root unavailable");
      }

      if (!hud) {
        hud = document.createElement("div");
        hud.id = "boot-status";
        root.appendChild(hud);
      }

      hud.setAttribute("role", "status");
      hud.setAttribute("aria-live", "polite");
      hud.style.display = "none";

      return hud;
    }, null);
  }

  function get2D(canvas) {
    return safeRun("get2D", function () {
      var ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("2D context unavailable");
      }
      return ctx;
    }, null);
  }

  function sizeCanvas() {
    return safeRun("sizeCanvas", function () {
      var dpr = window.devicePixelRatio || 1;
      var w;
      var h;

      if (dpr < 1) dpr = 1;
      if (dpr > 2) dpr = 2;

      w = Math.max(1, Math.floor(window.innerWidth * dpr));
      h = Math.max(1, Math.floor(window.innerHeight * dpr));

      APP.dpr = dpr;
      APP.width = w;
      APP.height = h;
      APP.cx = w * 0.5;
      APP.cy = h * 0.58;

      APP.canvas.width = w;
      APP.canvas.height = h;

      APP.canvas.setAttribute("data-css-width", String(window.innerWidth));
      APP.canvas.setAttribute("data-css-height", String(window.innerHeight));
      APP.canvas.setAttribute("data-dpr", String(APP.dpr));

      return true;
    }, false);
  }

  function buildUniverse() {
    return safeRun("buildUniverse", function () {
      var i;
      var starCount;
      var baseRadius;
      var orbitCount;
      var radius;
      var tilt;
      var speed;
      var angle;
      var planetRadius;
      var tone;

      APP.stars = [];
      APP.orbitBands = [];
      APP.planets = [];

      starCount = Math.max(90, Math.floor((window.innerWidth * window.innerHeight) / 14000));
      baseRadius = Math.min(APP.width, APP.height) * 0.12;
      orbitCount = 5;

      for (i = 0; i < starCount; i += 1) {
        APP.stars.push({
          x: rand(0, APP.width),
          y: rand(0, APP.height),
          r: rand(0.5, 1.6) * APP.dpr,
          a: rand(0.18, 0.95),
          tw: rand(0.3, 1.4),
          phase: rand(0, Math.PI * 2)
        });
      }

      for (i = 0; i < orbitCount; i += 1) {
        radius = baseRadius * (1.18 + i * 0.46);
        tilt = 0.42 - i * 0.03;
        speed = 0.00014 + i * 0.00005;
        angle = rand(0, Math.PI * 2);
        planetRadius = (6 + i * 2.5) * APP.dpr;

        if (i === 0) tone = "rgba(188,205,255,0.95)";
        else if (i === 1) tone = "rgba(220,210,190,0.90)";
        else if (i === 2) tone = "rgba(165,195,235,0.92)";
        else if (i === 3) tone = "rgba(210,185,150,0.88)";
        else tone = "rgba(185,190,210,0.86)";

        APP.orbitBands.push({
          rx: radius,
          ry: radius * tilt,
          lineWidth: Math.max(1, Math.floor(APP.dpr * (1 + i * 0.15))),
          alpha: 0.11 + i * 0.015
        });

        APP.planets.push({
          orbitIndex: i,
          angle: angle,
          speed: speed,
          r: planetRadius,
          color: tone
        });
      }

      APP.universeReady = true;
      return true;
    }, false);
  }

  function drawBackground(ctx) {
    var g = ctx.createLinearGradient(0, 0, 0, APP.height);
    g.addColorStop(0, "#020611");
    g.addColorStop(0.40, "#09182d");
    g.addColorStop(1, "#132946");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, APP.width, APP.height);
  }

  function drawStarField(ctx, t) {
    var i;
    var s;
    var alpha;
    var cross;

    for (i = 0; i < APP.stars.length; i += 1) {
      s = APP.stars[i];
      alpha = s.a * (0.72 + 0.28 * Math.sin(t * 0.001 * s.tw + s.phase));
      alpha = clamp(alpha, 0.08, 1);

      ctx.fillStyle = "rgba(255,255,255," + String(alpha) + ")";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      if (s.r > 1.2 * APP.dpr) {
        cross = s.r * 2.4;
        ctx.strokeStyle = "rgba(255,255,255," + String(alpha * 0.22) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x - cross, s.y);
        ctx.lineTo(s.x + cross, s.y);
        ctx.moveTo(s.x, s.y - cross);
        ctx.lineTo(s.x, s.y + cross);
        ctx.stroke();
      }
    }
  }

  function drawSunGlow(ctx) {
    var outer = Math.min(APP.width, APP.height) * 0.20;
    var inner = Math.min(APP.width, APP.height) * 0.058;
    var g = ctx.createRadialGradient(APP.cx, APP.cy, 0, APP.cx, APP.cy, outer);

    g.addColorStop(0, "rgba(255,248,228,0.92)");
    g.addColorStop(0.10, "rgba(255,235,180,0.65)");
    g.addColorStop(0.22, "rgba(255,220,130,0.24)");
    g.addColorStop(1, "rgba(255,200,100,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(APP.cx, APP.cy, outer, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,246,220,0.96)";
    ctx.beginPath();
    ctx.arc(APP.cx, APP.cy, inner, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = Math.max(1, Math.floor(APP.dpr * 1.2));
    ctx.beginPath();
    ctx.arc(APP.cx, APP.cy, inner * 1.26, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawOrbits(ctx) {
    var i;
    var orbit;

    ctx.save();
    ctx.translate(APP.cx, APP.cy);

    for (i = 0; i < APP.orbitBands.length; i += 1) {
      orbit = APP.orbitBands[i];
      ctx.strokeStyle = "rgba(205,220,255," + String(orbit.alpha) + ")";
      ctx.lineWidth = orbit.lineWidth;
      ctx.beginPath();
      ctx.ellipse(0, 0, orbit.rx, orbit.ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawPlanets(ctx) {
    var i;
    var p;
    var orbit;
    var x;
    var y;

    for (i = 0; i < APP.planets.length; i += 1) {
      p = APP.planets[i];
      orbit = APP.orbitBands[p.orbitIndex];

      x = APP.cx + Math.cos(p.angle) * orbit.rx;
      y = APP.cy + Math.sin(p.angle) * orbit.ry;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = Math.max(1, Math.floor(APP.dpr));
      ctx.beginPath();
      ctx.arc(x, y, p.r + 1.3 * APP.dpr, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawDepthGrid(ctx) {
    var left = APP.width * 0.12;
    var right = APP.width * 0.88;
    var top = APP.height * 0.14;
    var bottom = APP.height * 0.88;
    var i;
    var y;
    var x;
    var rows = 5;
    var cols = 5;

    ctx.strokeStyle = "rgba(190,210,255,0.035)";
    ctx.lineWidth = 1;

    for (i = 0; i <= rows; i += 1) {
      y = top + ((bottom - top) / rows) * i;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();
    }

    for (i = 0; i <= cols; i += 1) {
      x = left + ((right - left) / cols) * i;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
    }
  }

  function drawCaption(ctx) {
    var titleSize = Math.max(20, Math.floor(Math.min(APP.width, APP.height) * 0.026));
    var subSize = Math.max(11, Math.floor(Math.min(APP.width, APP.height) * 0.012));

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#eef3ff";
    ctx.font = titleSize + "px system-ui, sans-serif";
    ctx.fillText("Universe Online", APP.cx, APP.cy + Math.min(APP.width, APP.height) * 0.22);

    ctx.fillStyle = "rgba(185,200,226,0.92)";
    ctx.font = subSize + "px ui-monospace, monospace";
    ctx.fillText("euclidean runtime active", APP.cx, APP.cy + Math.min(APP.width, APP.height) * 0.255);

    ctx.restore();
  }

  function updateSimulation(ts) {
    var i;
    var p;

    for (i = 0; i < APP.planets.length; i += 1) {
      p = APP.planets[i];
      p.angle += p.speed * (16 + (ts % 3));
    }
  }

  function renderFrame(ts) {
    safeRun("renderFrame", function () {
      if (!APP.ctx) {
        throw new Error("2D context missing");
      }

      updateSimulation(ts);
      drawBackground(APP.ctx);
      drawDepthGrid(APP.ctx);
      drawStarField(APP.ctx, ts);
      drawOrbits(APP.ctx);
      drawSunGlow(APP.ctx);
      drawPlanets(APP.ctx);
      drawCaption(APP.ctx);
      updateHud();
    }, null);

    APP.raf = requestAnimationFrame(renderFrame);
  }

  function updateHud() {
    return safeRun("updateHud", function () {
      var elapsed = Date.now() - APP.START_TS;
      APP.hud.textContent =
        "STATE=" + APP.state +
        " | NAME=" + APP.NAME +
        " | VERSION=" + APP.VERSION +
        " | ELAPSED_MS=" + elapsed +
        " | ERRORS=" + APP.errors.length +
        " | WARNINGS=" + APP.warnings.length +
        "\nUNIVERSE=" + (APP.universeReady ? "ONLINE" : "OFFLINE") +
        " | STARS=" + APP.stars.length +
        " | ORBITS=" + APP.orbitBands.length +
        " | PLANETS=" + APP.planets.length +
        " | GEOMETRY=EUCLIDEAN_ONLY";
    }, null);
  }

  function installResize() {
    return safeRun("installResize", function () {
      var resizeRaf = 0;

      function onResize() {
        if (resizeRaf) {
          cancelAnimationFrame(resizeRaf);
        }

        resizeRaf = requestAnimationFrame(function () {
          sizeCanvas();
          buildUniverse();
          updateHud();
        });
      }

      window.addEventListener("resize", onResize, false);
      window.addEventListener("orientationchange", onResize, false);
    }, null);
  }

  function installGlobalErrorHooks() {
    return safeRun("installGlobalErrorHooks", function () {
      window.addEventListener("error", function (event) {
        var message = "Unknown window error";

        if (event) {
          if (event.error && event.error.message) {
            message = event.error.message;
          } else if (event.message) {
            message = event.message;
          }
        }

        pushError("window.error", message);
        APP.state = "DEGRADED";
        updateHud();
        log("error", "Unhandled window error", { message: message });
      });

      window.addEventListener("unhandledrejection", function (event) {
        var reason = "Unknown promise rejection";

        if (event && typeof event.reason !== "undefined") {
          if (event.reason && event.reason.message) {
            reason = event.reason.message;
          } else {
            reason = String(event.reason);
          }
        }

        pushError("unhandledrejection", reason);
        APP.state = "DEGRADED";
        updateHud();
        log("error", "Unhandled promise rejection", { reason: reason });
      });
    }, null);
  }

  function exposeState() {
    return safeRun("exposeState", function () {
      window.__INDEX_UNIVERSE__ = {
        NAME: APP.NAME,
        VERSION: APP.VERSION,
        START_TS: APP.START_TS,
        state: APP.state,
        errors: APP.errors,
        warnings: APP.warnings,
        getSummary: function () {
          return {
            state: APP.state,
            stars: APP.stars.length,
            orbits: APP.orbitBands.length,
            planets: APP.planets.length,
            width: APP.width,
            height: APP.height,
            dpr: APP.dpr
          };
        }
      };
    }, null);
  }

  function boot() {
    APP.root = ensureRoot();
    if (!APP.root) {
      throw new Error("Unable to establish app root");
    }

    APP.canvas = ensureCanvas(APP.root);
    if (!APP.canvas) {
      throw new Error("Unable to establish canvas");
    }

    APP.hud = ensureHud(APP.root);
    if (!APP.hud) {
      throw new Error("Unable to establish HUD");
    }

    APP.ctx = get2D(APP.canvas);
    if (!APP.ctx) {
      throw new Error("Unable to acquire 2D context");
    }

    sizeCanvas();
    buildUniverse();
    installResize();
    installGlobalErrorHooks();
    exposeState();

    APP.state = APP.errors.length ? "DEGRADED" : "READY";
    updateHud();

    if (APP.raf) {
      cancelAnimationFrame(APP.raf);
    }
    APP.raf = requestAnimationFrame(renderFrame);

    log("info", "Euclidean universe boot completed", {
      state: APP.state,
      stars: APP.stars.length,
      orbits: APP.orbitBands.length,
      planets: APP.planets.length
    });
  }

  function start() {
    safeRun("start", boot, null);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, false);
  } else {
    start();
  }
})();
