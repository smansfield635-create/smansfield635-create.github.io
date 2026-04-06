(() => {
  "use strict";

  const BOOT = {
    NAME: "INDEX_BOOT_SAFE_BASELINE_V1",
    VERSION: "1.0.0",
    START_TS: Date.now(),
    state: "BOOTING",
    errors: [],
    warnings: [],
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_) {
      return "";
    }
  }

  function log(level, message, extra) {
    const payload = {
      t: nowIso(),
      boot: BOOT.NAME,
      level,
      message,
      ...(extra && typeof extra === "object" ? { extra } : {}),
    };
    try {
      if (level === "error") console.error(payload);
      else if (level === "warn") console.warn(payload);
      else console.log(payload);
    } catch (_) {}
  }

  function safeRun(label, fn, fallback = null) {
    try {
      return fn();
    } catch (error) {
      BOOT.errors.push({ label, message: String(error && error.message ? error.message : error) });
      log("error", `${label} failed`, { error: String(error && error.stack ? error.stack : error) });
      return fallback;
    }
  }

  function ensureBody() {
    return safeRun("ensureBody", () => {
      if (document.body) return document.body;
      const body = document.createElement("body");
      document.documentElement.appendChild(body);
      return body;
    });
  }

  function ensureRoot() {
    return safeRun("ensureRoot", () => {
      const body = ensureBody();
      if (!body) throw new Error("document.body unavailable");

      let root =
        document.getElementById("app") ||
        document.getElementById("root") ||
        document.querySelector("[data-app-root]");

      if (!root) {
        root = document.createElement("div");
        root.id = "app";
        root.setAttribute("data-app-root", "true");
        body.appendChild(root);
        BOOT.warnings.push("No app root found; created #app.");
      }

      return root;
    });
  }

  function ensureCanvas(root) {
    return safeRun("ensureCanvas", () => {
      let canvas =
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
        canvas.style.inset = "0";
        canvas.style.zIndex = "0";
        root.appendChild(canvas);
        BOOT.warnings.push("No canvas found; created #scene.");
      }

      return canvas;
    });
  }

  function ensureHud(root) {
    return safeRun("ensureHud", () => {
      let hud = document.getElementById("boot-status");

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
    });
  }

  function resizeCanvas(canvas) {
    return safeRun("resizeCanvas", () => {
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      const width = Math.max(1, Math.floor(window.innerWidth * dpr));
      const height = Math.max(1, Math.floor(window.innerHeight * dpr));

      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;

      canvas.dataset.cssWidth = String(window.innerWidth);
      canvas.dataset.cssHeight = String(window.innerHeight);
      canvas.dataset.dpr = String(dpr);

      return { width, height, dpr };
    });
  }

  function get2D(canvas) {
    return safeRun("get2D", () => {
      const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
      if (!ctx) throw new Error("2D context unavailable");
      return ctx;
    });
  }

  function renderBootFrame(ctx, canvas) {
    return safeRun("renderBootFrame", () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#01040c");
      bg.addColorStop(0.5, "#04101f");
      bg.addColorStop(1, "#09172d");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;
      const r = Math.min(w, h) * 0.18;
      const t = (Date.now() - BOOT.START_TS) / 1000;

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
      ctx.font = `${Math.max(18, Math.floor(Math.min(w, h) * 0.028))}px system-ui, sans-serif`;
      ctx.fillText("Boot Restored", cx, cy + r + 40);

      ctx.fillStyle = "rgba(169,184,220,0.95)";
      ctx.font = `${Math.max(11, Math.floor(Math.min(w, h) * 0.014))}px ui-monospace, monospace`;
      ctx.fillText("index.js baseline active", cx, cy + r + 68);
      ctx.restore();
    });
  }

  function updateHud(hud) {
    return safeRun("updateHud", () => {
      const elapsed = Date.now() - BOOT.START_TS;
      hud.textContent =
        `BOOT=${BOOT.state} | NAME=${BOOT.NAME} | VERSION=${BOOT.VERSION} | ` +
        `ELAPSED_MS=${elapsed} | ERRORS=${BOOT.errors.length} | WARNINGS=${BOOT.warnings.length}`;
    });
  }

  function installGlobalErrorHooks(hud) {
    safeRun("installGlobalErrorHooks", () => {
      window.addEventListener("error", (event) => {
        const message = event?.error?.message || event?.message || "Unknown window error";
        BOOT.errors.push({ label: "window.error", message: String(message) });
        BOOT.state = "DEGRADED";
        updateHud(hud);
        log("error", "Unhandled window error", { message });
      });

      window.addEventListener("unhandledrejection", (event) => {
        const reason = event?.reason?.message || event?.reason || "Unknown promise rejection";
        BOOT.errors.push({ label: "unhandledrejection", message: String(reason) });
        BOOT.state = "DEGRADED";
        updateHud(hud);
        log("error", "Unhandled promise rejection", { reason: String(reason) });
      });
    });
  }

  function installResize(canvas, ctx, hud) {
    safeRun("installResize", () => {
      let raf = 0;

      const onResize = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          resizeCanvas(canvas);
          renderBootFrame(ctx, canvas);
          updateHud(hud);
        });
      };

      window.addEventListener("resize", onResize, { passive: true });
      window.addEventListener("orientationchange", onResize, { passive: true });
    });
  }

  function boot() {
    const root = ensureRoot();
    if (!root) throw new Error("Unable to establish app root");

    const canvas = ensureCanvas(root);
    if (!canvas) throw new Error("Unable to establish canvas");

    const hud = ensureHud(root);
    if (!hud) throw new Error("Unable to establish HUD");

    installGlobalErrorHooks(hud);

    resizeCanvas(canvas);
    const ctx = get2D(canvas);
    if (!ctx) throw new Error("Unable to acquire 2D context");

    renderBootFrame(ctx, canvas);
    installResize(canvas, ctx, hud);

    BOOT.state = BOOT.errors.length ? "DEGRADED" : "READY";
    updateHud(hud);

    window.__INDEX_BOOT__ = {
      ...BOOT,
      canvasId: canvas.id,
      rootId: root.id || null,
      hudId: hud.id,
    };

    log("info", "Boot completed", window.__INDEX_BOOT__);
  }

  function start() {
    safeRun("start", boot);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
