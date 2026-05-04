/*
  /assets/earth/earth_canvas.js
  EARTH_G4_SURFACE_PHASE_ROTATION_CONTROL_TNT_v1

  Purpose:
  - Preserve Earth as its own independent canvas authority.
  - Fix disk rotation by forbidding whole-object / whole-canvas rotation.
  - Rotate Earth by internal surface longitude phase only.
  - Keep the Earth canvas, sphere mask, frame, and placement fixed.
  - Preserve Earth route independence and block Audralia adoption.

  Scope:
  - Earth canvas/source authority only.
  - No route rewrite.
  - No Showroom selector mutation.
  - No Audralia mutation.
  - No Gauges mutation.
  - No image generation.
  - No static picture replacement.

  Expected mount:
  - #earthRenderMount

  Public API:
  - createProfile
  - renderEarth
  - renderSurface
  - mount
  - buildTexture
  - getStatus
  - verifyAssets
  - registerExtension
*/

(function () {
  "use strict";

  const VERSION = "EARTH_G4_SURFACE_PHASE_ROTATION_CONTROL_TNT_v1";

  const EARTH = Object.freeze({
    id: "earth",
    label: "Earth",
    route: "/showroom/globe/earth/",
    authority: "/assets/earth/earth_canvas.js",
    generation: "G4_SURFACE_PHASE_ROTATION",
    referenceStandard: "NASA_BLUE_MARBLE_REFERENCE_DISCIPLINE",
    canvasBoundary: "fixed",
    objectBoundary: "natural-sphere-mask",
    rotationModel: "surface-longitude-phase",
    diskRotation: "forbidden"
  });

  const ASSETS = Object.freeze({
    surface: "/assets/earth/earth_surface_2048.jpg",
    clouds: "/assets/earth/earth_clouds_2048.jpg"
  });

  const DEFAULTS = Object.freeze({
    maxDevicePixelRatio: 2,
    surfaceAutoStep: 0.0009,
    cloudAutoStep: 0.00042,
    dragLongitudeFactor: 0.0017,
    dragLatitudeFactor: 0.0011,
    releaseFriction: 0.945,
    minVelocity: 0.00002,
    axisTiltDegrees: 23.5,
    minZoom: 0.82,
    maxZoom: 1.42,
    initialZoom: 1,
    latitudeLimit: 0.18,
    renderReceipt: false
  });

  const instanceStore = new WeakMap();
  const imageCache = Object.create(null);

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function normalizeNumber(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function loadImage(src) {
    if (imageCache[src]) return imageCache[src];

    imageCache[src] = new Promise(function (resolve) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";

      img.onload = function () {
        resolve({
          ok: true,
          src,
          image: img,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height
        });
      };

      img.onerror = function () {
        resolve({
          ok: false,
          src,
          image: null,
          width: 0,
          height: 0
        });
      };

      img.src = src;
    });

    return imageCache[src];
  }

  function createFallbackTexture(width, height, variant) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    const ocean = variant === "clouds" ? "#ffffff" : "#0e4f92";
    const land = variant === "clouds" ? "rgba(255,255,255,0.62)" : "#3f8c58";
    const dry = variant === "clouds" ? "rgba(255,255,255,0.38)" : "#b58d57";

    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, width, height);

    function blob(cx, cy, rx, ry, color) {
      ctx.beginPath();

      for (let i = 0; i <= 80; i += 1) {
        const a = (Math.PI * 2 * i) / 80;
        const noise =
          1 +
          Math.sin(a * 3 + cx * 0.01) * 0.08 +
          Math.sin(a * 7 + cy * 0.01) * 0.045;

        const x = cx + Math.cos(a) * rx * noise;
        const y = cy + Math.sin(a) * ry * noise;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    if (variant === "clouds") {
      for (let i = 0; i < 26; i += 1) {
        const x = ((i * 193) % width) + 24;
        const y = ((i * 89) % height) + 18;
        blob(x, y, 70 + (i % 5) * 14, 16 + (i % 3) * 6, i % 2 ? land : dry);
      }
    } else {
      blob(width * 0.22, height * 0.48, width * 0.14, height * 0.25, land);
      blob(width * 0.38, height * 0.42, width * 0.13, height * 0.18, dry);
      blob(width * 0.55, height * 0.48, width * 0.16, height * 0.21, land);
      blob(width * 0.72, height * 0.46, width * 0.12, height * 0.16, dry);
      blob(width * 0.84, height * 0.60, width * 0.08, height * 0.08, land);

      ctx.fillStyle = "rgba(238,245,248,0.88)";
      ctx.fillRect(0, 0, width, height * 0.07);
      ctx.fillRect(0, height * 0.93, width, height * 0.07);
    }

    return canvas;
  }

  function createProfile(overrides) {
    return Object.assign(
      {
        id: EARTH.id,
        label: EARTH.label,
        route: EARTH.route,
        authority: EARTH.authority,
        version: VERSION,
        generation: EARTH.generation,
        referenceStandard: EARTH.referenceStandard,
        canvasBoundary: EARTH.canvasBoundary,
        objectBoundary: EARTH.objectBoundary,
        rotationModel: EARTH.rotationModel,
        diskRotation: EARTH.diskRotation,
        wholeCanvasTransform: "forbidden",
        wholeObjectRotation: "forbidden",
        surfacePhaseRotation: "active",
        cloudPhaseRotation: "active",
        placementFixed: true,
        publicReceipts: "hidden",
        visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION",
        assets: ASSETS,
        api: {
          createProfile: true,
          renderEarth: true,
          renderSurface: true,
          mount: true,
          buildTexture: true,
          getStatus: true,
          verifyAssets: true,
          registerExtension: true
        }
      },
      overrides || {}
    );
  }

  function createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.className = "earth-g4-canvas earth-surface-phase-canvas";
    canvas.dataset.body = EARTH.id;
    canvas.dataset.authority = EARTH.authority;
    canvas.dataset.version = VERSION;
    canvas.dataset.generation = EARTH.generation;
    canvas.dataset.rotationModel = EARTH.rotationModel;
    canvas.dataset.diskRotation = "forbidden";
    canvas.dataset.canvasBoundary = "fixed";
    canvas.dataset.objectBoundary = "natural-sphere-mask";
    canvas.dataset.publicReceipts = "hidden";
    canvas.dataset.visualPass = "held";
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Earth G4 canvas using fixed sphere placement and surface longitude phase rotation"
    );
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = "760px";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";
    canvas.style.border = "0";
    canvas.style.outline = "0";
    canvas.style.background = "transparent";
    canvas.style.boxShadow = "none";
    canvas.style.transform = "none";
    canvas.style.translate = "none";
    return canvas;
  }

  function sizeCanvas(canvas, mount, state) {
    const rect = mount && mount.getBoundingClientRect ? mount.getBoundingClientRect() : null;
    const cssSize = Math.max(
      280,
      Math.min(
        760,
        normalizeNumber(state.options.size, 0) ||
          Math.floor(Math.min(rect && rect.width ? rect.width : 640, window.innerWidth - 32))
      )
    );

    const dpr = Math.min(
      DEFAULTS.maxDevicePixelRatio,
      Math.max(1, window.devicePixelRatio || 1)
    );

    const pixelSize = Math.max(320, Math.floor(cssSize * dpr));

    if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
      canvas.width = pixelSize;
      canvas.height = pixelSize;
    }

    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

    state.size = pixelSize;
    state.cssSize = cssSize;
    state.dpr = dpr;
  }

  function drawWrappedStrip(ctx, img, phase, sy, sh, dx, dy, dw, dh) {
    if (!img || !img.width || !img.height || dw <= 0 || dh <= 0) return;

    const sourceWidth = img.width;
    const sourceHeight = img.height;
    const start = wrap01(phase) * sourceWidth;
    const safeSy = clamp(sy, 0, sourceHeight - 1);
    const safeSh = clamp(sh, 1, sourceHeight - safeSy);

    const firstSourceWidth = sourceWidth - start;
    const firstDestWidth = dw * (firstSourceWidth / sourceWidth);
    const secondDestWidth = dw - firstDestWidth;

    ctx.drawImage(
      img,
      start,
      safeSy,
      firstSourceWidth,
      safeSh,
      dx,
      dy,
      firstDestWidth,
      dh
    );

    if (secondDestWidth > 0.5) {
      ctx.drawImage(
        img,
        0,
        safeSy,
        start,
        safeSh,
        dx + firstDestWidth,
        dy,
        secondDestWidth,
        dh
      );
    }
  }

  function drawTextureSphere(ctx, state, img, phase, alpha, yPhaseOffset) {
    const size = state.size;
    const cx = size / 2;
    const cy = size / 2;
    const zoom = clamp(state.zoom, DEFAULTS.minZoom, DEFAULTS.maxZoom);
    const r = size * 0.405 * zoom;
    const strip = Math.max(1, Math.floor(size / 360));
    const sourceHeight = img && img.height ? img.height : 512;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalAlpha = alpha;

    for (let y = -r; y <= r; y += strip) {
      const yMid = y + strip / 2;
      const normalizedY = yMid / r;
      const chord = Math.sqrt(Math.max(0, 1 - normalizedY * normalizedY));
      const width = r * 2 * chord;
      const destX = cx - width / 2;
      const destY = cy + y;

      const v = clamp(
        0.5 + normalizedY * 0.5 + state.latitudeOffset + (yPhaseOffset || 0),
        0,
        1
      );

      const sy = Math.floor(v * (sourceHeight - 1));
      const sh = Math.max(1, Math.ceil((strip / (r * 2)) * sourceHeight * 1.8));

      drawWrappedStrip(ctx, img, phase, sy, sh, destX, destY, width, strip + 1);
    }

    ctx.restore();
  }

  function drawFallbackLoading(ctx, state) {
    const size = state.size;
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.405;

    ctx.save();
    ctx.clearRect(0, 0, size, size);

    const ocean = ctx.createRadialGradient(cx - r * 0.28, cy - r * 0.25, r * 0.08, cx, cy, r);
    ocean.addColorStop(0, "#2b86c5");
    ocean.addColorStop(0.58, "#105b96");
    ocean.addColorStop(1, "#071f58");

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = ocean;
    ctx.fill();

    ctx.fillStyle = "rgba(246,239,224,0.78)";
    ctx.font = `${Math.max(14, Math.floor(size * 0.035))}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Earth", cx, cy + r + Math.max(26, size * 0.055));

    ctx.restore();
  }

  function drawShading(ctx, state) {
    const size = state.size;
    const cx = size / 2;
    const cy = size / 2;
    const zoom = clamp(state.zoom, DEFAULTS.minZoom, DEFAULTS.maxZoom);
    const r = size * 0.405 * zoom;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    const daylight = ctx.createRadialGradient(
      cx - r * 0.38,
      cy - r * 0.34,
      r * 0.02,
      cx,
      cy,
      r * 1.18
    );

    daylight.addColorStop(0, "rgba(255,255,255,0.28)");
    daylight.addColorStop(0.32, "rgba(255,255,255,0.08)");
    daylight.addColorStop(0.68, "rgba(0,0,0,0.10)");
    daylight.addColorStop(1, "rgba(0,0,0,0.48)");

    ctx.fillStyle = daylight;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const terminator = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    terminator.addColorStop(0, "rgba(255,255,255,0.05)");
    terminator.addColorStop(0.44, "rgba(255,255,255,0.00)");
    terminator.addColorStop(0.72, "rgba(0,0,0,0.14)");
    terminator.addColorStop(1, "rgba(0,0,0,0.34)");

    ctx.fillStyle = terminator;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const edge = ctx.createRadialGradient(cx, cy, r * 0.68, cx, cy, r);
    edge.addColorStop(0, "rgba(0,0,0,0)");
    edge.addColorStop(0.78, "rgba(0,0,0,0.08)");
    edge.addColorStop(1, "rgba(0,0,0,0.36)");

    ctx.fillStyle = edge;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();
  }

  function drawAxisReceipt(ctx, state) {
    const size = state.size;
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.405 * clamp(state.zoom, DEFAULTS.minZoom, DEFAULTS.maxZoom);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((DEFAULTS.axisTiltDegrees * Math.PI) / 180);
    ctx.strokeStyle = "rgba(245,199,107,0.28)";
    ctx.lineWidth = Math.max(1, size * 0.0018);
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.08);
    ctx.lineTo(0, r * 1.08);
    ctx.stroke();
    ctx.restore();
  }

  function renderFrame(state) {
    const canvas = state.canvas;
    const ctx = state.ctx;

    if (!canvas || !ctx) return;

    sizeCanvas(canvas, state.mount, state);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const surfaceImage =
      state.assets.surface.ok && state.assets.surface.image
        ? state.assets.surface.image
        : state.fallbackSurface;

    const cloudImage =
      state.assets.clouds.ok && state.assets.clouds.image
        ? state.assets.clouds.image
        : state.fallbackClouds;

    if (!surfaceImage) {
      drawFallbackLoading(ctx, state);
      return;
    }

    drawTextureSphere(ctx, state, surfaceImage, state.surfacePhase, 1, 0);
    drawTextureSphere(ctx, state, cloudImage, state.cloudPhase, 0.38, -state.latitudeOffset * 0.35);
    drawShading(ctx, state);

    if (state.options.axisReceipt === true) {
      drawAxisReceipt(ctx, state);
    }

    state.canvas.dataset.surfacePhase = state.surfacePhase.toFixed(5);
    state.canvas.dataset.cloudPhase = state.cloudPhase.toFixed(5);
    state.canvas.dataset.latitudeOffset = state.latitudeOffset.toFixed(5);
    state.canvas.dataset.zoom = state.zoom.toFixed(3);
    state.canvas.dataset.rotationModel = "surface-longitude-phase";
    state.canvas.dataset.diskRotation = "forbidden";
  }

  function tick(state) {
    if (!state.running) return;

    state.surfacePhase = wrap01(state.surfacePhase + state.options.surfaceAutoStep + state.velocityX);
    state.cloudPhase = wrap01(state.cloudPhase + state.options.cloudAutoStep + state.velocityX * 0.42);

    state.velocityX *= state.options.releaseFriction;

    if (Math.abs(state.velocityX) < state.options.minVelocity) {
      state.velocityX = 0;
    }

    renderFrame(state);
    state.raf = window.requestAnimationFrame(function () {
      tick(state);
    });
  }

  function setStatusDataset(mount, state) {
    if (!mount) return;

    mount.dataset.body = EARTH.id;
    mount.dataset.earthAuthority = EARTH.authority;
    mount.dataset.version = VERSION;
    mount.dataset.generation = EARTH.generation;
    mount.dataset.canvasBoundary = "fixed";
    mount.dataset.objectBoundary = "natural-sphere-mask";
    mount.dataset.rotationModel = "surface-longitude-phase";
    mount.dataset.diskRotation = "forbidden";
    mount.dataset.wholeCanvasTransform = "forbidden";
    mount.dataset.wholeObjectRotation = "forbidden";
    mount.dataset.surfacePhaseRotation = "active";
    mount.dataset.cloudPhaseRotation = "active";
    mount.dataset.placementFixed = "true";
    mount.dataset.audraliaAdoption = "blocked";
    mount.dataset.publicReceipts = "hidden";

    if (state) {
      mount.dataset.surfacePhase = state.surfacePhase.toFixed(5);
      mount.dataset.cloudPhase = state.cloudPhase.toFixed(5);
      mount.dataset.latitudeOffset = state.latitudeOffset.toFixed(5);
      mount.dataset.zoom = state.zoom.toFixed(3);
    }
  }

  function attachControls(state) {
    const canvas = state.canvas;

    function pointerPoint(event) {
      const source = event.touches && event.touches[0] ? event.touches[0] : event;
      return {
        x: source.clientX,
        y: source.clientY
      };
    }

    function onPointerDown(event) {
      const point = pointerPoint(event);
      state.dragging = true;
      state.lastX = point.x;
      state.lastY = point.y;
      state.velocityX = 0;

      canvas.dataset.dragging = "true";

      if (canvas.setPointerCapture && event.pointerId !== undefined) {
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch (error) {
          // Pointer capture is optional.
        }
      }
    }

    function onPointerMove(event) {
      if (!state.dragging) return;

      const point = pointerPoint(event);
      const dx = point.x - state.lastX;
      const dy = point.y - state.lastY;

      state.lastX = point.x;
      state.lastY = point.y;

      const longitudeDelta = -dx * state.options.dragLongitudeFactor;
      state.surfacePhase = wrap01(state.surfacePhase + longitudeDelta);
      state.cloudPhase = wrap01(state.cloudPhase + longitudeDelta * 0.52);
      state.velocityX = longitudeDelta * 0.55;

      state.latitudeOffset = clamp(
        state.latitudeOffset + dy * state.options.dragLatitudeFactor,
        -state.options.latitudeLimit,
        state.options.latitudeLimit
      );

      renderFrame(state);
      setStatusDataset(state.mount, state);

      if (event.cancelable) event.preventDefault();
    }

    function onPointerUp() {
      state.dragging = false;
      canvas.dataset.dragging = "false";
    }

    function onWheel(event) {
      if (!event) return;

      const delta = event.deltaY > 0 ? -0.045 : 0.045;
      state.zoom = clamp(state.zoom + delta, state.options.minZoom, state.options.maxZoom);
      renderFrame(state);
      setStatusDataset(state.mount, state);

      if (event.cancelable) event.preventDefault();
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    state.cleanup.push(function () {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
    });
  }

  function createHiddenReceipt(mount) {
    const receipt = document.createElement("div");
    receipt.hidden = true;
    receipt.setAttribute("aria-hidden", "true");
    receipt.className = "earth-g4-hidden-receipt";
    receipt.dataset.body = EARTH.id;
    receipt.dataset.authority = EARTH.authority;
    receipt.dataset.version = VERSION;
    receipt.dataset.rotationModel = "surface-longitude-phase";
    receipt.dataset.diskRotation = "forbidden";
    receipt.dataset.publicReceipts = "hidden";
    receipt.textContent =
      "EARTH_G4_SURFACE_PHASE_ROTATION_CONTROL_TNT_v1 surface_phase_rotation=active disk_rotation=forbidden visual_pass=held";

    if (mount) mount.appendChild(receipt);
  }

  function normalizeOptions(options) {
    const incoming = options || {};

    return {
      size: incoming.size,
      axisReceipt: incoming.axisReceipt === true,
      surfaceAutoStep: normalizeNumber(incoming.surfaceAutoStep, DEFAULTS.surfaceAutoStep),
      cloudAutoStep: normalizeNumber(incoming.cloudAutoStep, DEFAULTS.cloudAutoStep),
      dragLongitudeFactor: normalizeNumber(
        incoming.dragLongitudeFactor,
        DEFAULTS.dragLongitudeFactor
      ),
      dragLatitudeFactor: normalizeNumber(incoming.dragLatitudeFactor, DEFAULTS.dragLatitudeFactor),
      releaseFriction: normalizeNumber(incoming.releaseFriction, DEFAULTS.releaseFriction),
      minVelocity: normalizeNumber(incoming.minVelocity, DEFAULTS.minVelocity),
      minZoom: normalizeNumber(incoming.minZoom, DEFAULTS.minZoom),
      maxZoom: normalizeNumber(incoming.maxZoom, DEFAULTS.maxZoom),
      initialZoom: normalizeNumber(incoming.initialZoom, DEFAULTS.initialZoom),
      latitudeLimit: normalizeNumber(incoming.latitudeLimit, DEFAULTS.latitudeLimit),
      renderReceipt:
        incoming.renderReceipt === true || incoming.hiddenReceipt === true
          ? true
          : DEFAULTS.renderReceipt
    };
  }

  function createInstance(mount, options) {
    const target =
      typeof mount === "string"
        ? document.querySelector(mount)
        : mount && mount.nodeType === 1
          ? mount
          : document.getElementById("earthRenderMount");

    if (!target) return null;

    const existing = instanceStore.get(target);
    if (existing && typeof existing.destroy === "function") {
      existing.destroy();
    }

    const canvas = createCanvas();
    const ctx = canvas.getContext("2d", { alpha: true });
    const normalizedOptions = normalizeOptions(options);

    const state = {
      mount: target,
      canvas,
      ctx,
      options: normalizedOptions,
      running: false,
      dragging: false,
      raf: 0,
      size: 0,
      cssSize: 0,
      dpr: 1,
      surfacePhase: wrap01(normalizeNumber(options && options.initialPhase, 0.18)),
      cloudPhase: wrap01(normalizeNumber(options && options.initialCloudPhase, 0.08)),
      latitudeOffset: clamp(
        normalizeNumber(options && options.initialLatitudeOffset, 0),
        -normalizedOptions.latitudeLimit,
        normalizedOptions.latitudeLimit
      ),
      velocityX: 0,
      zoom: clamp(
        normalizedOptions.initialZoom,
        normalizedOptions.minZoom,
        normalizedOptions.maxZoom
      ),
      assets: {
        surface: { ok: false, image: null },
        clouds: { ok: false, image: null }
      },
      fallbackSurface: createFallbackTexture(1024, 512, "surface"),
      fallbackClouds: createFallbackTexture(1024, 512, "clouds"),
      cleanup: []
    };

    target.replaceChildren();
    target.appendChild(canvas);
    setStatusDataset(target, state);

    if (normalizedOptions.renderReceipt === true) {
      createHiddenReceipt(target);
    }

    attachControls(state);
    renderFrame(state);

    Promise.all([loadImage(ASSETS.surface), loadImage(ASSETS.clouds)]).then(function (results) {
      state.assets.surface = results[0];
      state.assets.clouds = results[1];
      target.dataset.surfaceAssetLoaded = String(Boolean(results[0] && results[0].ok));
      target.dataset.cloudAssetLoaded = String(Boolean(results[1] && results[1].ok));
      renderFrame(state);
    });

    function start() {
      if (state.running) return api;
      state.running = true;
      state.raf = window.requestAnimationFrame(function () {
        tick(state);
      });
      return api;
    }

    function stop() {
      state.running = false;

      if (state.raf) {
        window.cancelAnimationFrame(state.raf);
        state.raf = 0;
      }

      return api;
    }

    function reset() {
      state.surfacePhase = 0.18;
      state.cloudPhase = 0.08;
      state.latitudeOffset = 0;
      state.velocityX = 0;
      state.zoom = normalizedOptions.initialZoom;
      renderFrame(state);
      setStatusDataset(target, state);
      return api;
    }

    function destroy() {
      stop();
      state.cleanup.forEach(function (fn) {
        fn();
      });
      state.cleanup = [];
      instanceStore.delete(target);
      return true;
    }

    function status() {
      return getStatus({
        surfacePhase: state.surfacePhase,
        cloudPhase: state.cloudPhase,
        latitudeOffset: state.latitudeOffset,
        zoom: state.zoom,
        running: state.running,
        surfaceAssetLoaded: Boolean(state.assets.surface && state.assets.surface.ok),
        cloudAssetLoaded: Boolean(state.assets.clouds && state.assets.clouds.ok)
      });
    }

    const api = Object.freeze({
      canvas,
      mount: target,
      start,
      stop,
      reset,
      destroy,
      getStatus: status
    });

    instanceStore.set(target, api);
    start();

    return api;
  }

  function renderEarth(mount, options) {
    return createInstance(mount, options);
  }

  function renderSurface(mount, options) {
    return renderEarth(mount, options);
  }

  function mount(mountTarget, options) {
    return renderEarth(mountTarget, options);
  }

  function buildTexture(options) {
    const config = options || {};
    const size = Math.max(256, Math.min(2048, Number(config.size) || 768));
    const canvas = createCanvas();
    canvas.width = size;
    canvas.height = size;

    const target = document.createElement("div");
    target.style.position = "fixed";
    target.style.left = "-99999px";
    target.style.top = "-99999px";
    target.style.width = size + "px";
    target.style.height = size + "px";
    target.appendChild(canvas);

    const state = {
      mount: target,
      canvas,
      ctx: canvas.getContext("2d", { alpha: true }),
      options: normalizeOptions(config),
      size,
      cssSize: size,
      dpr: 1,
      surfacePhase: wrap01(normalizeNumber(config.phase, 0.18)),
      cloudPhase: wrap01(normalizeNumber(config.cloudPhase, 0.08)),
      latitudeOffset: clamp(
        normalizeNumber(config.latitudeOffset, 0),
        -DEFAULTS.latitudeLimit,
        DEFAULTS.latitudeLimit
      ),
      zoom: clamp(normalizeNumber(config.zoom, 1), DEFAULTS.minZoom, DEFAULTS.maxZoom),
      assets: {
        surface: { ok: false, image: null },
        clouds: { ok: false, image: null }
      },
      fallbackSurface: createFallbackTexture(1024, 512, "surface"),
      fallbackClouds: createFallbackTexture(1024, 512, "clouds")
    };

    renderFrame(state);

    if (config.returnObject === true) {
      return {
        canvas,
        version: VERSION,
        profile: createProfile(),
        status: getStatus()
      };
    }

    return canvas;
  }

  function verifyAssets() {
    return Promise.all([loadImage(ASSETS.surface), loadImage(ASSETS.clouds)]).then(function (
      results
    ) {
      return {
        version: VERSION,
        surface: {
          path: ASSETS.surface,
          ok: Boolean(results[0] && results[0].ok),
          width: results[0] ? results[0].width : 0,
          height: results[0] ? results[0].height : 0
        },
        clouds: {
          path: ASSETS.clouds,
          ok: Boolean(results[1] && results[1].ok),
          width: results[1] ? results[1].width : 0,
          height: results[1] ? results[1].height : 0
        }
      };
    });
  }

  function getStatus(extra) {
    return Object.assign(
      {
        version: VERSION,
        body: EARTH.id,
        label: EARTH.label,
        route: EARTH.route,
        authority: EARTH.authority,
        generation: EARTH.generation,
        referenceStandard: EARTH.referenceStandard,
        canvasBoundary: EARTH.canvasBoundary,
        objectBoundary: EARTH.objectBoundary,
        rotationModel: EARTH.rotationModel,
        surfacePhaseRotation: "active",
        cloudPhaseRotation: "active",
        diskRotation: "forbidden",
        wholeCanvasTransform: "forbidden",
        wholeObjectRotation: "forbidden",
        placementFixed: true,
        audraliaAdoption: "blocked",
        publicReceipts: "hidden",
        visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION",
        protectedNonJurisdiction: [
          "Audralia",
          "Showroom selector",
          "Showroom CSS",
          "Gauges",
          "Products",
          "Sun",
          "Moon",
          "global files"
        ],
        returnReceipt:
          "EARTH_CANVAS_FIXED_SURFACE_LONGITUDE_PHASE_ACTIVE_DISK_ROTATION_FORBIDDEN"
      },
      extra || {}
    );
  }

  function registerExtension(target) {
    if (!target || typeof target !== "object") return window.DGBEarthCanvas;

    if (typeof target.registerRenderer === "function") {
      target.registerRenderer(EARTH.id, window.DGBEarthCanvas);
    }

    if (typeof target.registerPlanet === "function") {
      target.registerPlanet(createProfile(), window.DGBEarthCanvas);
    }

    if (typeof target.registerExtension === "function") {
      target.registerExtension(EARTH.id, window.DGBEarthCanvas);
    }

    if (target.extensions && typeof target.extensions === "object") {
      target.extensions[EARTH.id] = window.DGBEarthCanvas;
    }

    if (target.planets && typeof target.planets === "object") {
      target.planets[EARTH.id] = createProfile();
    }

    return window.DGBEarthCanvas;
  }

  function autoRegister() {
    [
      window.DGBPlanetRegistry,
      window.DGBShowroomPlanetRegistry,
      window.DGBShowroomGlobeInstrument,
      window.DGBEarthRegistry
    ].forEach(function (registry) {
      if (registry) registerExtension(registry);
    });

    window.dispatchEvent(
      new CustomEvent("dgb:earth-canvas-ready", {
        detail: {
          body: EARTH.id,
          label: EARTH.label,
          version: VERSION,
          generation: EARTH.generation,
          rotationModel: EARTH.rotationModel,
          api: window.DGBEarthCanvas
        }
      })
    );
  }

  function autoMount() {
    const target =
      document.getElementById("earthRenderMount") ||
      document.querySelector("[data-earth-render-mount]") ||
      document.querySelector("[data-body='earth'][data-render-mount]");

    if (!target) return;

    renderEarth(target, {
      hiddenReceipt: true,
      renderReceipt: true
    });
  }

  const api = Object.freeze({
    version: VERSION,
    earth: EARTH,
    assets: ASSETS,
    createProfile,
    renderEarth,
    renderSurface,
    render: renderEarth,
    mount,
    buildTexture,
    verifyAssets,
    getStatus,
    registerExtension
  });

  window.DGBEarthCanvas = api;
  window.DGBEarthCanvasAuthority = api;
  window.EarthCanvas = api;
  window.earthCanvas = api;

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        autoRegister();
        autoMount();
      },
      { once: true }
    );
  } else {
    autoRegister();
    autoMount();
  }
})();
