(function () {
  "use strict";

  var BOOT = {
    NAME: "INDEX_BOOT_SAFE_BASELINE_V2",
    VERSION: "1.0.1",
    START_TS: Date.now(),
    state: "BOOTING",
    errors: [],
    warnings: []
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (e) {
      return "";
    }
  }

  function pushError(label, message) {
    BOOT.errors.push({
      label: String(label || "unknown"),
      message: String(message || "unknown")
    });
  }

  function pushWarning(message) {
    BOOT.warnings.push(String(message || "unknown"));
  }

  function log(level, message, extra) {
    var payload = {
      t: nowIso(),
      boot: BOOT.NAME,
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

  function ensureBody() {
    return safeRun("ensureBody", function () {
      if (document.body) {
        return document.body;
      }

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
        canvas.setAttribute("aria-label", "Main display");
        canvas.style.display = "block";
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.right = "0";
        canvas.style.bottom = "0";
        canvas.style.left = "0";
        canvas.style.zIndex = "0";
        root.appendChild(canvas);
        pushWarning("No canvas found; created #scene.");
      }

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
        hud.style.position = "fixed";
        hud.style.top = "12px";
        hud.style.left = "12px";
        hud.style.right = "12px";
        hud.style.maxWidth = "560px";
        hud.style.padding = "10px 12px";
        hud.style.border = "1px solid rgba(255,255,255,0.14)";
        hud.style.borderRadius = "12px";
        hud.style.background = "rgba(5,11,24,0.72)";
        hud.style.backdropFilter = "blur(10px)";
        hud.style.color = "#eef3ff";
        hud.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
        hud.style.fontSize = "12px";
        hud.style.lineHeight = "1.4";
        hud.style.zIndex = "10";
        hud.style.pointerEvents = "none";
        root.appendChild(hud);
      }

      return hud;
    }, null);
  }

  function resizeCanvas(canvas) {
    return safeRun("resizeCanvas", function () {
      var dpr = window.devicePixelRatio || 1;
      var width;
      var height;

      if (dpr < 1) dpr = 1;
      if (dpr > 2) dpr = 2;

      width = Math.max(1, Math.floor(window.innerWidth * dpr));
      height = Math.max(1, Math.floor(window.innerHeight * dpr));

      if (canvas.width !== width) {
        canvas.width = width;
      }

      if (canvas.height !== height) {
        canvas.height = height;
      }

      canvas.setAttribute("data-css-width", String(window.innerWidth));
      canvas.setAttribute("data-css-height", String(window.innerHeight));
      canvas.setAttribute("data-dpr", String(dpr));

      return {
        width: width,
        height: height,
        dpr: dpr
      };
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

  function renderBootFrame(ctx, canvas) {
    return safeRun("renderBootFrame", function () {
      var w = canvas.width;
      var h = canvas.height;
      var bg;
      var cx;
      var cy;
      var r;
      var t;

      ctx.clearRect(0, 0, w, h);

      bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#01040c");
      bg.addColorStop(0.5, "#04101f");
      bg.addColorStop(1, "#09172d");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      cx = w * 0.5;
      cy = h * 0.5;
      r = Math.min(w, h) * 0.18;
      t = (Date.now() - BOOT.START_TS) / 1000;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.35);

      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r, 0);
      ctx.closePath();
      ctx.strokeStyle = "rgba(238,243,255,0.9)";
      ctx.lineWidth = Math.max(2, Math.floor(Math.min(w, h) * 0.004));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -r * 0.6);
      ctx.lineTo(r * 0.6, 0);
      ctx.lineTo(0, r * 0.6);
      ctx.lineTo(-r * 0.6, 0);
      ctx.closePath();
      ctx.strokeStyle = "rgba(169,184,220,0.65)";
      ctx.lineWidth = Math.max(1, Math.floor(Math.min(w, h) * 0.0025));
      ctx.stroke();

      ctx.restore();

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#eef3ff";
      ctx.font = Math.max(18, Math.floor(Math.min(w, h) * 0.028)) + "px system-ui, sans-serif";
      ctx.fillText("Boot Restored", cx, cy + r + 40);

      ctx.fillStyle = "rgba(169,184,220,0.95)";
      ctx.font = Math.max(11, Math.floor(Math.min(w, h) * 0.014)) + "px ui-monospace, monospace";
      ctx.fillText("index.js baseline active", cx, cy + r + 68);
      ctx.restore();
    }, null);
  }

  function updateHud(hud) {
    return safeRun("updateHud", function () {
      var elapsed = Date.now() - BOOT.START_TS;
      hud.textContent =
        "BOOT=" + BOOT.state +
        " | NAME=" + BOOT.NAME +
        " | VERSION=" + BOOT.VERSION +
        " | ELAPSED_MS=" + elapsed +
        " | ERRORS=" + BOOT.errors.length +
        " | WARNINGS=" + BOOT.warnings.length;
    }, null);
  }

  function installGlobalErrorHooks(hud) {
    safeRun("installGlobalErrorHooks", function () {
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
        BOOT.state = "DEGRADED";
        updateHud(hud);
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
        BOOT.state = "DEGRADED";
        updateHud(hud);
        log("error", "Unhandled promise rejection", { reason: reason });
      });
    }, null);
  }

  function installResize(canvas, ctx, hud) {
    safeRun("installResize", function () {
      var raf = 0;

      function onResize() {
        if (raf) {
          cancelAnimationFrame(raf);
        }

        raf = requestAnimationFrame(function () {
          resizeCanvas(canvas);
          renderBootFrame(ctx, canvas);
          updateHud(hud);
        });
      }

      window.addEventListener("resize", onResize, false);
      window.addEventListener("orientationchange", onResize, false);
    }, null);
  }

  function exposeBoot(root, canvas, hud) {
    safeRun("exposeBoot", function () {
      window.__INDEX_BOOT__ = {
        NAME: BOOT.NAME,
        VERSION: BOOT.VERSION,
        START_TS: BOOT.START_TS,
        state: BOOT.state,
        errors: BOOT.errors.slice(),
        warnings: BOOT.warnings.slice(),
        canvasId: canvas ? canvas.id : null,
        rootId: root ? (root.id || null) : null,
        hudId: hud ? hud.id : null
      };
    }, null);
  }

  function boot() {
    var root = ensureRoot();
    var canvas;
    var hud;
    var ctx;

    if (!root) {
      throw new Error("Unable to establish app root");
    }

    canvas = ensureCanvas(root);
    if (!canvas) {
      throw new Error("Unable to establish canvas");
    }

    hud = ensureHud(root);
    if (!hud) {
      throw new Error("Unable to establish HUD");
    }

    installGlobalErrorHooks(hud);

    resizeCanvas(canvas);

    ctx = get2D(canvas);
    if (!ctx) {
      throw new Error("Unable to acquire 2D context");
    }

    renderBootFrame(ctx, canvas);
    installResize(canvas, ctx, hud);

    BOOT.state = BOOT.errors.length ? "DEGRADED" : "READY";
    updateHud(hud);
    exposeBoot(root, canvas, hud);

    log("info", "Boot completed", window.__INDEX_BOOT__);
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
