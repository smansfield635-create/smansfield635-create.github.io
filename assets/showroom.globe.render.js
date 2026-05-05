// /showroom/globe/audralia/index.js
// AUDRALIA_ROUTE_AXIS_AND_NATURAL_ROTATION_CONTROL_TNT_v1
//
// Role:
// - Audralia route-level mount, axis, and natural rotation control.
// - Consumes /assets/audralia/audralia.planet.render.js as baseline land/water body authority.
// - Keeps terrain, hydration, climate, ecology, and fauna out of this route-control file.
//
// Owns:
// - Audralia route boot
// - Audralia mount control
// - fixed route stage
// - fixed canvas placement
// - axis presentation
// - natural surface-phase rotation
// - touch spin / release inertia
// - hidden route-control receipts
//
// Does not own:
// - parent land/water generation
// - terrain pressure
// - hydration
// - climate
// - ecology
// - fauna
// - Earth behavior
// - Gauges
// - Products
// - Sun
// - Moon
// - global files
// - visual pass claim

(function () {
  "use strict";

  const RECEIPT = "AUDRALIA_ROUTE_AXIS_AND_NATURAL_ROTATION_CONTROL_TNT_v1";

  const ROUTE = "/showroom/globe/audralia/";
  const BODY = "audralia";
  const LABEL = "Audralia";
  const PARENT_AUTHORITY = "/assets/audralia/audralia.planet.render.js";

  const CONTROL = Object.freeze({
    axisDegrees: 21.5,
    autoStep: 0.00042,
    dragFactor: 0.00172,
    releaseFriction: 0.952,
    minVelocity: 0.000014,
    initialPhase: 0.18,
    minSize: 320,
    maxSize: 720,
    textureWidth: 1024,
    textureHeight: 512,
    rotationModel: "audralia-natural-surface-phase",
    touchModel: "horizontal-spin-only",
    diskRotation: "forbidden",
    wholeCanvasRotation: "forbidden",
    textureStretch: "forbidden",
    visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION"
  });

  let activeState = null;

  function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.max(min, Math.min(max, number));
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function query(selector) {
    return document.querySelector(selector);
  }

  function getMount() {
    return (
      document.getElementById("audraliaRenderMount") ||
      document.getElementById("audreliaRenderMount") ||
      query("[data-audralia-render-mount]") ||
      query("[data-audrelia-render-mount]") ||
      query("[data-body='audralia'][data-render-mount]") ||
      query("[data-body='audrelia'][data-render-mount]")
    );
  }

  function markRoute() {
    document.documentElement.dataset.activeBody = BODY;
    document.documentElement.dataset.activeRoute = ROUTE;
    document.documentElement.dataset.audraliaRouteControl = RECEIPT;
    document.documentElement.dataset.earthAdoption = "blocked";
    document.documentElement.dataset.audraliaRotationModel = CONTROL.rotationModel;
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";

    document.body.dataset.activeBody = BODY;
    document.body.dataset.activeRoute = ROUTE;
    document.body.dataset.audraliaRouteControl = RECEIPT;
    document.body.dataset.earthAdoption = "blocked";
    document.body.dataset.publicReceipts = "hidden";
  }

  function ensureStyle() {
    if (document.getElementById("audralia-axis-rotation-control-style")) return;

    const style = document.createElement("style");
    style.id = "audralia-axis-rotation-control-style";
    style.textContent = `
      #audraliaRenderMount,
      #audreliaRenderMount,
      [data-audralia-render-mount],
      [data-audrelia-render-mount],
      [data-body="audralia"][data-render-mount],
      [data-body="audrelia"][data-render-mount] {
        position: relative;
        display: grid;
        place-items: center;
        min-height: clamp(360px, 72vw, 720px);
        overflow: visible;
        isolation: isolate;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
      }

      .audralia-axis-stage {
        position: relative;
        display: grid;
        place-items: center;
        width: min(100%, 760px);
        aspect-ratio: 1 / 1;
        overflow: visible;
        isolation: isolate;
      }

      .audralia-axis-stage::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(74vw, 620px);
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background:
          radial-gradient(circle, rgba(92, 170, 238, 0.18), transparent 68%),
          radial-gradient(circle, rgba(255, 255, 255, 0.05), transparent 48%);
        filter: blur(2px);
        pointer-events: none;
        z-index: 0;
      }

      .audralia-axis-line {
        position: absolute;
        left: 50%;
        top: 50%;
        height: min(82vw, 690px);
        width: 2px;
        transform: translate(-50%, -50%) rotate(var(--audralia-axis-deg));
        transform-origin: center;
        background: linear-gradient(
          180deg,
          transparent 0%,
          rgba(210, 235, 255, 0.20) 12%,
          rgba(210, 235, 255, 0.42) 50%,
          rgba(210, 235, 255, 0.20) 88%,
          transparent 100%
        );
        box-shadow: 0 0 18px rgba(104, 175, 255, 0.18);
        pointer-events: none;
        z-index: 1;
      }

      .audralia-rotation-canvas {
        position: relative;
        z-index: 2;
        display: block;
        width: min(100%, 680px);
        max-width: min(100%, 680px);
        aspect-ratio: 1 / 1;
        border: 0;
        outline: 0;
        border-radius: 50%;
        background: transparent;
        box-shadow:
          inset -24px -18px 44px rgba(0, 0, 0, 0.32),
          inset 12px 10px 24px rgba(255, 255, 255, 0.07),
          0 0 0 1px rgba(184, 217, 255, 0.18),
          0 0 34px rgba(105, 177, 255, 0.22),
          0 0 86px rgba(105, 177, 255, 0.12);
        transform: none !important;
        rotate: none !important;
        scale: none !important;
        translate: none !important;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
      }

      .audralia-axis-label {
        position: absolute;
        left: 50%;
        bottom: clamp(18px, 5vw, 44px);
        z-index: 4;
        transform: translateX(-50%);
        border: 1px solid rgba(210, 235, 255, 0.18);
        border-radius: 999px;
        padding: 0.62rem 0.96rem;
        color: rgba(246, 239, 224, 0.92);
        background: rgba(5, 10, 20, 0.68);
        font: 900 clamp(0.7rem, 2.4vw, 0.92rem) / 1.1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        pointer-events: none;
      }

      .audralia-hidden-receipt {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  function loadParentAuthority() {
    const existingApi =
      window.DGBAudraliaPlanetRender ||
      window.AudraliaPlanetRender ||
      window.audraliaPlanetRender ||
      window.DGBAudreliaPlanetRender ||
      window.AudreliaPlanetRender ||
      window.audreliaPlanetRender;

    if (existingApi && typeof existingApi.buildTexture === "function") {
      return Promise.resolve(existingApi);
    }

    const existingScript = document.querySelector("script[src*='/assets/audralia/audralia.planet.render.js']");

    if (existingScript) {
      return new Promise(function (resolve) {
        const attempt = function () {
          const api =
            window.DGBAudraliaPlanetRender ||
            window.AudraliaPlanetRender ||
            window.audraliaPlanetRender ||
            window.DGBAudreliaPlanetRender ||
            window.AudreliaPlanetRender ||
            window.audreliaPlanetRender;

          if (api && typeof api.buildTexture === "function") {
            resolve(api);
            return;
          }

          window.setTimeout(attempt, 40);
        };

        attempt();
      });
    }

    return new Promise(function (resolve) {
      const script = document.createElement("script");
      script.src = PARENT_AUTHORITY + "?v=audralia-parent-baseline-for-route-axis-control";
      script.defer = true;
      script.dataset.audraliaParentAuthority = "true";
      script.dataset.contract = RECEIPT;

      script.onload = function () {
        resolve(
          window.DGBAudraliaPlanetRender ||
            window.AudraliaPlanetRender ||
            window.audraliaPlanetRender ||
            window.DGBAudreliaPlanetRender ||
            window.AudreliaPlanetRender ||
            window.audreliaPlanetRender ||
            null
        );
      };

      script.onerror = function () {
        resolve(null);
      };

      document.head.appendChild(script);
    });
  }

  function createFallbackTexture(width, height) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    const ocean = ctx.createLinearGradient(0, 0, width, height);
    ocean.addColorStop(0, "#08306a");
    ocean.addColorStop(0.55, "#145c94");
    ocean.addColorStop(1, "#061b4d");

    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, width, height);

    function blob(cx, cy, rx, ry, color) {
      ctx.beginPath();

      for (let i = 0; i <= 80; i += 1) {
        const a = (Math.PI * 2 * i) / 80;
        const wobble = 1 + Math.sin(a * 3 + cx * 0.01) * 0.08 + Math.sin(a * 7 + cy * 0.01) * 0.05;
        const x = cx + Math.cos(a) * rx * wobble;
        const y = cy + Math.sin(a) * ry * wobble;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    blob(width * 0.43, height * 0.49, width * 0.14, height * 0.18, "#77925f");
    blob(width * 0.18, height * 0.49, width * 0.10, height * 0.14, "#8d8b58");
    blob(width * 0.70, height * 0.51, width * 0.11, height * 0.14, "#3f8c58");
    blob(width * 0.58, height * 0.66, width * 0.08, height * 0.07, "#9a8f5c");
    blob(width * 0.50, height * 0.08, width * 0.18, height * 0.06, "#d4e7ee");

    ctx.fillStyle = "rgba(240, 249, 255, 0.88)";
    ctx.fillRect(0, height * 0.91, width, height * 0.08);

    return canvas;
  }

  function buildTexture(api) {
    if (api && typeof api.buildTexture === "function") {
      try {
        const texture = api.buildTexture({
          width: CONTROL.textureWidth,
          height: CONTROL.textureHeight
        });

        if (texture && texture.getContext && texture.width && texture.height) {
          return texture;
        }
      } catch (error) {
        // Fallback below keeps route alive.
      }
    }

    return createFallbackTexture(CONTROL.textureWidth, CONTROL.textureHeight);
  }

  function createStage(mount) {
    const stage = document.createElement("div");
    stage.className = "audralia-axis-stage";
    stage.dataset.body = BODY;
    stage.dataset.route = ROUTE;
    stage.dataset.contract = RECEIPT;
    stage.dataset.axisDegrees = String(CONTROL.axisDegrees);
    stage.dataset.rotationModel = CONTROL.rotationModel;
    stage.dataset.diskRotation = CONTROL.diskRotation;
    stage.dataset.textureStretch = CONTROL.textureStretch;
    stage.style.setProperty("--audralia-axis-deg", CONTROL.axisDegrees + "deg");

    const axis = document.createElement("div");
    axis.className = "audralia-axis-line";
    axis.dataset.axis = "audralia-fixed-axis";
    axis.dataset.axisDegrees = String(CONTROL.axisDegrees);

    const canvas = document.createElement("canvas");
    canvas.className = "audralia-rotation-canvas";
    canvas.dataset.body = BODY;
    canvas.dataset.contract = RECEIPT;
    canvas.dataset.rotationModel = CONTROL.rotationModel;
    canvas.dataset.touchModel = CONTROL.touchModel;
    canvas.dataset.diskRotation = CONTROL.diskRotation;
    canvas.dataset.wholeCanvasRotation = CONTROL.wholeCanvasRotation;
    canvas.dataset.textureStretch = CONTROL.textureStretch;
    canvas.dataset.visualPass = CONTROL.visualPass;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Audralia natural axis rotation control");

    const label = document.createElement("div");
    label.className = "audralia-axis-label";
    label.textContent = "AUDRALIA · AXIS ROTATION";

    const receipt = document.createElement("div");
    receipt.hidden = true;
    receipt.setAttribute("aria-hidden", "true");
    receipt.className = "audralia-hidden-receipt";
    receipt.dataset.contract = RECEIPT;
    receipt.dataset.route = ROUTE;
    receipt.dataset.parentAuthority = PARENT_AUTHORITY;
    receipt.dataset.axisDegrees = String(CONTROL.axisDegrees);
    receipt.dataset.rotationModel = CONTROL.rotationModel;
    receipt.dataset.visualPass = CONTROL.visualPass;
    receipt.textContent =
      "AUDRALIA_ROUTE_AXIS_AND_NATURAL_ROTATION_CONTROL_TNT_v1 planet_position=fixed canvas=fixed surface_phase=active disk_rotation=forbidden visual_pass=held";

    stage.appendChild(axis);
    stage.appendChild(canvas);
    stage.appendChild(label);
    stage.appendChild(receipt);

    mount.replaceChildren(stage);

    mount.dataset.body = BODY;
    mount.dataset.route = ROUTE;
    mount.dataset.contract = RECEIPT;
    mount.dataset.parentAuthority = PARENT_AUTHORITY;
    mount.dataset.axisDegrees = String(CONTROL.axisDegrees);
    mount.dataset.rotationModel = CONTROL.rotationModel;
    mount.dataset.touchModel = CONTROL.touchModel;
    mount.dataset.diskRotation = CONTROL.diskRotation;
    mount.dataset.wholeCanvasRotation = CONTROL.wholeCanvasRotation;
    mount.dataset.textureStretch = CONTROL.textureStretch;
    mount.dataset.visualPass = CONTROL.visualPass;
    mount.dataset.earthAdoption = "blocked";

    return { stage, canvas };
  }

  function sizeCanvas(canvas, mount) {
    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : null;
    const available = rect && rect.width ? rect.width : window.innerWidth - 32;
    const cssSize = clamp(Math.floor(available * 0.88), CONTROL.minSize, CONTROL.maxSize);
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    const px = Math.max(CONTROL.minSize, Math.floor(cssSize * dpr));

    if (canvas.width !== px || canvas.height !== px) {
      canvas.width = px;
      canvas.height = px;
    }

    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

    return px;
  }

  function drawWrappedStrip(ctx, texture, phase, sy, sh, dx, dy, dw, dh) {
    if (!texture || !texture.width || !texture.height || dw <= 0 || dh <= 0) return;

    const sourceWidth = texture.width;
    const sourceHeight = texture.height;
    const start = wrap01(phase) * sourceWidth;
    const safeSy = clamp(sy, 0, sourceHeight - 1);
    const safeSh = clamp(sh, 1, sourceHeight - safeSy);

    const firstSourceWidth = sourceWidth - start;
    const firstDestWidth = dw * (firstSourceWidth / sourceWidth);
    const secondDestWidth = dw - firstDestWidth;

    ctx.drawImage(texture, start, safeSy, firstSourceWidth, safeSh, dx, dy, firstDestWidth, dh);

    if (secondDestWidth > 0.5) {
      ctx.drawImage(texture, 0, safeSy, start, safeSh, dx + firstDestWidth, dy, secondDestWidth, dh);
    }
  }

  function drawSphere(ctx, texture, phase, size) {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.405;
    const stripHeight = Math.max(2, Math.floor(size / 260));
    const sourceHeight = texture.height || CONTROL.textureHeight;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    for (let y = -radius; y <= radius; y += stripHeight) {
      const yMid = y + stripHeight / 2;
      const normalizedY = yMid / radius;
      const chord = Math.sqrt(Math.max(0, 1 - normalizedY * normalizedY));
      const destWidth = radius * 2 * chord;
      const destX = cx - destWidth / 2;
      const destY = cy + y;
      const v = clamp(0.5 + normalizedY * 0.5, 0, 1);
      const sy = Math.floor(v * (sourceHeight - 1));
      const sh = Math.max(1, Math.ceil((stripHeight / (radius * 2)) * sourceHeight * 1.72));

      drawWrappedStrip(ctx, texture, phase, sy, sh, destX, destY, destWidth, stripHeight + 1);
    }

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const light = ctx.createRadialGradient(
      cx - radius * 0.34,
      cy - radius * 0.36,
      radius * 0.03,
      cx,
      cy,
      radius * 1.16
    );

    light.addColorStop(0, "rgba(255,255,255,0.20)");
    light.addColorStop(0.35, "rgba(255,255,255,0.06)");
    light.addColorStop(0.74, "rgba(0,0,0,0.10)");
    light.addColorStop(1, "rgba(0,0,0,0.42)");

    ctx.fillStyle = light;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const edge = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius);
    edge.addColorStop(0, "rgba(0,0,0,0)");
    edge.addColorStop(0.82, "rgba(8,23,44,0.10)");
    edge.addColorStop(1, "rgba(10,24,42,0.38)");

    ctx.fillStyle = edge;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(190, 226, 255, 0.28)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();
    ctx.restore();
  }

  function attachControls(state) {
    const canvas = state.canvas;

    function point(event) {
      const source = event.touches && event.touches[0] ? event.touches[0] : event;
      return {
        x: source.clientX,
        y: source.clientY
      };
    }

    function down(event) {
      const p = point(event);
      state.dragging = true;
      state.lastX = p.x;
      state.velocity = 0;
      canvas.dataset.dragging = "true";

      if (canvas.setPointerCapture && event.pointerId !== undefined) {
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch (error) {}
      }

      if (event.cancelable) event.preventDefault();
    }

    function move(event) {
      if (!state.dragging) return;

      const p = point(event);
      const dx = p.x - state.lastX;
      state.lastX = p.x;

      const delta = -dx * CONTROL.dragFactor;
      state.phase = wrap01(state.phase + delta);
      state.velocity = delta * 0.58;

      draw(state);

      if (event.cancelable) event.preventDefault();
    }

    function up() {
      state.dragging = false;
      canvas.dataset.dragging = "false";
    }

    canvas.addEventListener("pointerdown", down, { passive: false });
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    state.cleanup.push(function () {
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    });
  }

  function draw(state) {
    const size = sizeCanvas(state.canvas, state.mount);
    drawSphere(state.ctx, state.texture, state.phase, size);

    state.canvas.dataset.phase = state.phase.toFixed(5);
    state.canvas.dataset.velocity = state.velocity.toFixed(6);
    state.mount.dataset.phase = state.phase.toFixed(5);
    state.mount.dataset.velocity = state.velocity.toFixed(6);
  }

  function tick(state) {
    if (!state.running) return;

    state.phase = wrap01(state.phase + CONTROL.autoStep + state.velocity);
    state.velocity *= CONTROL.releaseFriction;

    if (Math.abs(state.velocity) < CONTROL.minVelocity) {
      state.velocity = 0;
    }

    draw(state);

    state.raf = window.requestAnimationFrame(function () {
      tick(state);
    });
  }

  function destroyActiveState() {
    if (!activeState) return;

    activeState.running = false;

    if (activeState.raf) {
      window.cancelAnimationFrame(activeState.raf);
    }

    activeState.cleanup.forEach(function (fn) {
      fn();
    });

    activeState = null;
  }

  function boot() {
    markRoute();
    ensureStyle();

    const mount = getMount();

    if (!mount) {
      document.documentElement.dataset.audraliaRouteControlStatus = "missing-mount";
      return;
    }

    destroyActiveState();

    loadParentAuthority().then(function (api) {
      const texture = buildTexture(api);
      const parts = createStage(mount);
      const ctx = parts.canvas.getContext("2d", { alpha: true });

      const state = {
        mount,
        stage: parts.stage,
        canvas: parts.canvas,
        ctx,
        texture,
        phase: CONTROL.initialPhase,
        velocity: 0,
        dragging: false,
        lastX: 0,
        running: false,
        raf: 0,
        cleanup: []
      };

      activeState = state;

      attachControls(state);
      draw(state);

      state.running = true;
      state.raf = window.requestAnimationFrame(function () {
        tick(state);
      });

      document.documentElement.dataset.audraliaRouteControlStatus = "active";
      document.documentElement.dataset.audraliaParentAuthorityLoaded = String(Boolean(api));
      mount.dataset.parentAuthorityLoaded = String(Boolean(api));

      window.dispatchEvent(
        new CustomEvent("dgb:audralia-axis-rotation-ready", {
          detail: {
            body: BODY,
            label: LABEL,
            route: ROUTE,
            contract: RECEIPT,
            parentAuthority: PARENT_AUTHORITY,
            axisDegrees: CONTROL.axisDegrees,
            rotationModel: CONTROL.rotationModel,
            visualPass: CONTROL.visualPass
          }
        })
      );
    });
  }

  window.DGBAudraliaRouteControl = Object.freeze({
    receipt: RECEIPT,
    body: BODY,
    label: LABEL,
    route: ROUTE,
    parentAuthority: PARENT_AUTHORITY,
    control: CONTROL,
    boot,
    getStatus: function () {
      return Object.freeze({
        ok: Boolean(activeState),
        receipt: RECEIPT,
        body: BODY,
        route: ROUTE,
        parentAuthority: PARENT_AUTHORITY,
        axisDegrees: CONTROL.axisDegrees,
        rotationModel: CONTROL.rotationModel,
        touchModel: CONTROL.touchModel,
        phase: activeState ? activeState.phase : null,
        velocity: activeState ? activeState.velocity : null,
        planetPosition: "fixed",
        canvas: "fixed",
        surfacePhase: "active",
        diskRotation: "forbidden",
        wholeCanvasRotation: "forbidden",
        textureStretch: "forbidden",
        earthInheritance: "forbidden",
        terrainOwnedHere: false,
        hydrationOwnedHere: false,
        climateOwnedHere: false,
        visualPassClaimed: false
      });
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
