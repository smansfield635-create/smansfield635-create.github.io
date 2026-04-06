(function () {
  "use strict";

  var APP = {
    NAME: "INDEX_UNIVERSE_ENTRY_V1",
    VERSION: "1.0.0",
    START_TS: Date.now(),
    state: "BOOTING",
    errors: [],
    warnings: [],
    raf: 0,
    stars: [],
    dust: [],
    rings: [],
    nebulae: [],
    root: null,
    canvas: null,
    hud: null,
    ctx: null,
    width: 0,
    height: 0,
    dpr: 1,
    cx: 0,
    cy: 0,
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
        canvas.setAttribute("aria-label", "Universe display");
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
        hud.setAttribute("role", "status");
        hud.setAttribute("aria-live", "polite");
        root.appendChild(hud);
      }

      hud.style.position = "fixed";
      hud.style.top = "18px";
      hud.style.left = "18px";
      hud.style.right = "18px";
      hud.style.maxWidth = "760px";
      hud.style.padding = "14px 16px";
      hud.style.border = "1px solid rgba(255,255,255,0.14)";
      hud.style.borderRadius = "22px";
      hud.style.background = "rgba(2,8,22,0.52)";
      hud.style.backdropFilter = "blur(10px)";
      hud.style.color = "#eef3ff";
      hud.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
      hud.style.fontSize = "12px";
      hud.style.lineHeight = "1.45";
      hud.style.zIndex = "10";
      hud.style.pointerEvents = "none";
      hud.style.whiteSpace = "pre-wrap";

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
      APP.cy = h * 0.5;

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
      var countStars;
      var countDust;
      var countNebulae;
      var countRings;

      APP.stars = [];
      APP.dust = [];
      APP.nebulae = [];
      APP.rings = [];

      countStars = Math.max(140, Math.floor((window.innerWidth * window.innerHeight) / 9000));
      countDust = Math.max(50, Math.floor((window.innerWidth * window.innerHeight) / 26000));
      countNebulae = 4;
      countRings = 3;

      for (i = 0; i < countStars; i += 1) {
        APP.stars.push({
          x: rand(0, APP.width),
          y: rand(0, APP.height),
          r: rand(0.6, 2.2) * APP.dpr,
          a: rand(0.25, 1.0),
          tw: rand(0.4, 1.6),
          drift: rand(0.002, 0.018),
          phase: rand(0, Math.PI * 2)
        });
      }

      for (i = 0; i < countDust; i += 1) {
        APP.dust.push({
          x: rand(0, APP.width),
          y: rand(0, APP.height),
          r: rand(18, 120) * APP.dpr,
          a: rand(0.02, 0.08),
          dx: rand(-0.03, 0.03),
          dy: rand(-0.02, 0.02)
        });
      }

      for (i = 0; i < countNebulae; i += 1) {
        APP.nebulae.push({
          x: rand(APP.width * 0.12, APP.width * 0.88),
          y: rand(APP.height * 0.12, APP.height * 0.88),
          r: rand(APP.width * 0.12, APP.width * 0.28),
          a: rand(0.05, 0.12)
        });
      }

      for (i = 0; i < countRings; i += 1) {
        APP.rings.push({
          r: Math.min(APP.width, APP.height) * (0.14 + i * 0.09),
          lw: Math.max(1, Math.floor((2 + i) * APP.dpr)),
          a: 0.05 + i * 0.025,
          speed: 0.03 + i * 0.02,
          offset: rand(0, Math.PI * 2)
        });
      }

      APP.universeReady = true;
      return true;
    }, false);
  }

  function drawBackground(ctx) {
    var g = ctx.createLinearGradient(0, 0, 0, APP.height);
    g.addColorStop(0, "#01040c");
    g.addColorStop(0.35, "#031021");
    g.addColorStop(0.7, "#04172d");
    g.addColorStop(1, "#071d38");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, APP.width, APP.height);
  }

  function drawNebulae(ctx, t) {
    var i;
    var n;
    var g;
    var pulse;

    for (i = 0; i < APP.nebulae.length; i += 1) {
      n = APP.nebulae[i];
      pulse = 1 + Math.sin(t * 0.00025 + i) * 0.08;
      g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * pulse);
      g.addColorStop(0, "rgba(90,130,255," + String(n.a) + ")");
      g.addColorStop(0.45, "rgba(70,110,220," + String(n.a * 0.45) + ")");
      g.addColorStop(1, "rgba(20,40,90,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawDust(ctx) {
    var i;
    var d;

    for (i = 0; i < APP.dust.length; i += 1) {
      d = APP.dust[i];
      d.x += d.dx * APP.dpr;
      d.y += d.dy * APP.dpr;

      if (d.x < -d.r) d.x = APP.width + d.r;
      if (d.x > APP.width + d.r) d.x = -d.r;
      if (d.y < -d.r) d.y = APP.height + d.r;
      if (d.y > APP.height + d.r) d.y = -d.r;

      ctx.fillStyle = "rgba(255,255,255," + String(d.a) + ")";
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStars(ctx, t) {
    var i;
    var s;
    var alpha;

    for (i = 0; i < APP.stars.length; i += 1) {
      s = APP.stars[i];
      alpha = s.a * (0.65 + 0.35 * Math.sin(t * 0.001 * s.tw + s.phase));

      ctx.fillStyle = "rgba(255,255,255," + String(clamp(alpha, 0.08, 1)) + ")";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      if (s.r > 1.4 * APP.dpr) {
        ctx.strokeStyle = "rgba(255,255,255," + String(alpha * 0.3) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x - s.r * 2.1, s.y);
        ctx.lineTo(s.x + s.r * 2.1, s.y);
        ctx.moveTo(s.x, s.y - s.r * 2.1);
        ctx.lineTo(s.x, s.y + s.r * 2.1);
        ctx.stroke();
      }
    }
  }

  function drawCore(ctx, t) {
    var coreR = Math.min(APP.width, APP.height) * 0.12;
    var innerR = coreR * 0.58;
    var glowR = coreR * 2.6;
    var g1;
    var g2;
    var phase = t * 0.00035;

    g1 = ctx.createRadialGradient(APP.cx, APP.cy, 0, APP.cx, APP.cy, glowR);
    g1.addColorStop(0, "rgba(245,248,255,0.28)");
    g1.addColorStop(0.25, "rgba(120,170,255,0.16)");
    g1.addColorStop(0.6, "rgba(60,110,220,0.07)");
    g1.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.arc(APP.cx, APP.cy, glowR, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(APP.cx, APP.cy);
    ctx.rotate(phase);

    ctx.strokeStyle = "rgba(238,243,255,0.9)";
    ctx.lineWidth = Math.max(2, Math.floor(APP.dpr * 2));
    ctx.beginPath();
    ctx.moveTo(0, -coreR);
    ctx.lineTo(coreR, 0);
    ctx.lineTo(0, coreR);
    ctx.lineTo(-coreR, 0);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = "rgba(170,190,230,0.42)";
    ctx.lineWidth = Math.max(1, Math.floor(APP.dpr * 1.2));
    ctx.beginPath();
    ctx.moveTo(0, -innerR);
    ctx.lineTo(innerR, 0);
    ctx.lineTo(0, innerR);
    ctx.lineTo(-innerR, 0);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();

    g2 = ctx.createRadialGradient(APP.cx, APP.cy, 0, APP.cx, APP.cy, coreR * 0.7);
    g2.addColorStop(0, "rgba(255,255,255,0.22)");
    g2.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(APP.cx, APP.cy, coreR * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawRings(ctx, t) {
    var i;
    var ring;
    var ry;
    var rot;

    ctx.save();
    ctx.translate(APP.cx, APP.cy);

    for (i = 0; i < APP.rings.length; i += 1) {
      ring = APP.rings[i];
      ry = ring.r * 0.32;
      rot = ring.offset + t * 0.0001 * ring.speed * 10;

      ctx.save();
      ctx.rotate(rot);
      ctx.strokeStyle = "rgba(180,210,255," + String(ring.a) + ")";
      ctx.lineWidth = ring.lw;
      ctx.beginPath();
      ctx.ellipse(0, 0, ring.r, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  function drawHorizon(ctx) {
    var y = APP.height * 0.82;
    var g = ctx.createLinearGradient(0, y - APP.height * 0.18, 0, APP.height);
    g.addColorStop(0, "rgba(15,35,68,0)");
    g.addColorStop(0.55, "rgba(10,30,62,0.22)");
    g.addColorStop(1, "rgba(5,18,38,0.82)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(APP.width * 0.2, y - 24 * APP.dpr, APP.width * 0.4, y - 6 * APP.dpr);
    ctx.quadraticCurveTo(APP.width * 0.62, y + 22 * APP.dpr, APP.width * 0.8, y - 10 * APP.dpr);
    ctx.quadraticCurveTo(APP.width * 0.9, y - 20 * APP.dpr, APP.width, y);
    ctx.lineTo(APP.width, APP.height);
    ctx.lineTo(0, APP.height);
    ctx.closePath();
    ctx.fill();
  }

  function drawCaption(ctx) {
    var titleSize = Math.max(20, Math.floor(Math.min(APP.width, APP.height) * 0.027));
    var subSize = Math.max(11, Math.floor(Math.min(APP.width, APP.height) * 0.012));

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#eef3ff";
    ctx.font = titleSize + "px system-ui, sans-serif";
    ctx.fillText("Universe Online", APP.cx, APP.cy + Math.min(APP.width, APP.height) * 0.19);

    ctx.fillStyle = "rgba(185,200,226,0.92)";
    ctx.font = subSize + "px ui-monospace, monospace";
    ctx.fillText("index.js universe entry active", APP.cx, APP.cy + Math.min(APP.width, APP.height) * 0.225);

    ctx.restore();
  }

  function renderFrame(ts) {
    safeRun("renderFrame", function () {
      if (!APP.ctx) {
        throw new Error("2D context missing");
      }

      drawBackground(APP.ctx);
      drawNebulae(APP.ctx, ts);
      drawDust(APP.ctx);
      drawStars(APP.ctx, ts);
      drawRings(APP.ctx, ts);
      drawCore(APP.ctx, ts);
      drawHorizon(APP.ctx);
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
        " | DUST=" + APP.dust.length +
        " | NEBULAE=" + APP.nebulae.length +
        " | RINGS=" + APP.rings.length;
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
            dust: APP.dust.length,
            nebulae: APP.nebulae.length,
            rings: APP.rings.length,
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

    log("info", "Universe boot completed", {
      state: APP.state,
      stars: APP.stars.length,
      dust: APP.dust.length,
      nebulae: APP.nebulae.length,
      rings: APP.rings.length
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
