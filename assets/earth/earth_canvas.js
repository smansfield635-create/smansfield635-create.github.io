/*
  /assets/earth/earth_canvas.js
  EARTH_G4_TOUCH_ROTATION_NO_STRETCH_CONTROL_TNT_v2

  Purpose:
  - Preserve Earth as its own independent canvas authority.
  - Fix touch control so finger drag rotates the surface instead of stretching the texture.
  - Keep canvas fixed, sphere mask fixed, object boundary fixed, and projection sampling fixed.
  - Use horizontal drag as longitude-phase rotation only.
  - Ignore vertical drag for now so vertical movement cannot deform the texture.
  - Preserve release inertia.
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

  const VERSION = "EARTH_G4_TOUCH_ROTATION_NO_STRETCH_CONTROL_TNT_v2";

  const EARTH = Object.freeze({
    id: "earth",
    label: "Earth",
    route: "/showroom/globe/earth/",
    authority: "/assets/earth/earth_canvas.js",
    generation: "G4_TOUCH_ROTATION_NO_STRETCH",
    referenceStandard: "NASA_BLUE_MARBLE_REFERENCE_DISCIPLINE",
    canvasBoundary: "fixed",
    sphereMask: "fixed",
    objectBoundary: "natural-sphere-mask",
    projectionSampling: "locked",
    rotationModel: "surface-longitude-phase",
    touchModel: "horizontal-drag-only",
    diskRotation: "forbidden",
    textureStretch: "forbidden"
  });

  const ASSETS = Object.freeze({
    surface: "/assets/earth/earth_surface_2048.jpg",
    clouds: "/assets/earth/earth_clouds_2048.jpg"
  });

  const DEFAULTS = Object.freeze({
    maxDevicePixelRatio: 2,
    surfaceAutoStep: 0.00065,
    cloudAutoStep: 0.00028,
    dragLongitudeFactor: 0.00185,
    releaseFriction: 0.948,
    minVelocity: 0.000018,
    minZoom: 0.86,
    maxZoom: 1.28,
    initialZoom: 1,
    initialPhase: 0.18,
    initialCloudPhase: 0.08,
    renderReceipt: true
  });

  const imageCache = Object.create(null);
  const instanceStore = new WeakMap();

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function normalizeNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function loadImage(src) {
    if (imageCache[src]) return imageCache[src];

    imageCache[src] = new Promise(function (resolve) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.decoding = "async";

      image.onload = function () {
        resolve({
          ok: true,
          src,
          image,
          width: image.naturalWidth || image.width,
          height: image.naturalHeight || image.height
        });
      };

      image.onerror = function () {
        resolve({
          ok: false,
          src,
          image: null,
          width: 0,
          height: 0
        });
      };

      image.src = src;
    });

    return imageCache[src];
  }

  function createFallbackTexture(width, height, variant) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = variant === "clouds" ? "rgba(255,255,255,0)" : "#0d4f8f";
    ctx.fillRect(0, 0, width, height);

    function blob(cx, cy, rx, ry, color) {
      ctx.beginPath();

      for (let i = 0; i <= 72; i += 1) {
        const angle = (Math.PI * 2 * i) / 72;
        const noise = 1 + Math.sin(angle * 3 + cx * 0.01) * 0.08 + Math.sin(angle * 7) * 0.04;
        const x = cx + Math.cos(angle) * rx * noise;
        const y = cy + Math.sin(angle) * ry * noise;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    if (variant === "clouds") {
      for (let i = 0; i < 34; i += 1) {
        blob(
          (i * 173) % width,
          (i * 91) % height,
          58 + (i % 5) * 18,
          14 + (i % 3) * 7,
          i % 2 ? "rgba(255,255,255,0.52)" : "rgba(255,255,255,0.34)"
        );
      }
    } else {
      blob(width * 0.24, height * 0.48, width * 0.13, height * 0.24, "#3f8c58");
      blob(width * 0.43, height * 0.43, width * 0.14, height * 0.17, "#b58d57");
      blob(width * 0.58, height * 0.49, width * 0.17, height * 0.20, "#3f8c58");
      blob(width * 0.75, height * 0.46, width * 0.12, height * 0.16, "#b58d57");
      blob(width * 0.86, height * 0.62, width * 0.07, height * 0.08, "#3f8c58");

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
        sphereMask: EARTH.sphereMask,
        objectBoundary: EARTH.objectBoundary,
        projectionSampling: EARTH.projectionSampling,
        rotationModel: EARTH.rotationModel,
        touchModel: EARTH.touchModel,
        diskRotation: EARTH.diskRotation,
        textureStretch: EARTH.textureStretch,
        verticalDragTextureEffect: "disabled",
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
    canvas.className = "earth-g4-canvas earth-touch-rotation-no-stretch";
    canvas.dataset.body = EARTH.id;
    canvas.dataset.authority = EARTH.authority;
    canvas.dataset.version = VERSION;
    canvas.dataset.generation = EARTH.generation;
    canvas.dataset.rotationModel = EARTH.rotationModel;
    canvas.dataset.touchModel = EARTH.touchModel;
    canvas.dataset.diskRotation = "forbidden";
    canvas.dataset.textureStretch = "forbidden";
    canvas.dataset.verticalDragTextureEffect = "disabled";
    canvas.dataset.canvasBoundary = "fixed";
    canvas.dataset.sphereMask = "fixed";
    canvas.dataset.objectBoundary = "natural-sphere-mask";
    canvas.dataset.projectionSampling = "locked";
    canvas.dataset.publicReceipts = "hidden";
    canvas.dataset.visualPass = "held";

    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Earth G4 canvas using fixed sphere projection and horizontal touch rotation without texture stretch"
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
    canvas.style.scale = "none";
    canvas.style.rotate = "none";

    return canvas;
  }

  function normalizeOptions(options) {
    const input = options || {};

    return {
      size: input.size,
      surfaceAutoStep: normalizeNumber(input.surfaceAutoStep, DEFAULTS.surfaceAutoStep),
      cloudAutoStep: normalizeNumber(input.cloudAutoStep, DEFAULTS.cloudAutoStep),
      dragLongitudeFactor: normalizeNumber(input.dragLongitudeFactor, DEFAULTS.dragLongitudeFactor),
      releaseFriction: normalizeNumber(input.releaseFriction, DEFAULTS.releaseFriction),
      minVelocity: normalizeNumber(input.minVelocity, DEFAULTS.minVelocity),
      minZoom: normalizeNumber(input.minZoom, DEFAULTS.minZoom),
      maxZoom: normalizeNumber(input.maxZoom, DEFAULTS.maxZoom),
      initialZoom: normalizeNumber(input.initialZoom, DEFAULTS.initialZoom),
      initialPhase: normalizeNumber(input.initialPhase, DEFAULTS.initialPhase),
      initialCloudPhase: normalizeNumber(input.initialCloudPhase, DEFAULTS.initialCloudPhase),
      renderReceipt: input.renderReceipt !== false
    };
  }

  function sizeCanvas(canvas, mount, state) {
    const rect = mount && mount.getBoundingClientRect ? mount.getBoundingClientRect() : null;
    const availableWidth = rect && rect.width ? rect.width : window.innerWidth - 32;

    const cssSize = Math.max(
      280,
      Math.min(760, normalizeNumber(state.options.size, 0) || Math.floor(availableWidth))
    );

    const dpr = Math.min(DEFAULTS.maxDevicePixelRatio, Math.max(1, window.devicePixelRatio || 1));
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

  function drawWrappedStrip(ctx, image, phase, sy, sh, dx, dy, dw, dh) {
    if (!image || !image.width || !image.height || dw <= 0 || dh <= 0) return;

    const imageWidth = image.width;
    const imageHeight = image.height;
    const start = wrap01(phase) * imageWidth;
    const safeSy = clamp(sy, 0, imageHeight - 1);
    const safeSh = clamp(sh, 1, imageHeight - safeSy);

    const firstSourceWidth = imageWidth - start;
    const firstDestWidth = dw * (firstSourceWidth / imageWidth);
    const secondDestWidth = dw - firstDestWidth;

    ctx.drawImage(
      image,
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
        image,
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

  function drawTextureSphere(ctx, state, image, phase, alpha) {
    const size = state.size;
    const center = size / 2;
    const zoom = clamp(state.zoom, state.options.minZoom, state.options.maxZoom);
    const radius = size * 0.405 * zoom;
    const stripHeight = Math.max(1, Math.floor(size / 360));
    const imageHeight = image && image.height ? image.height : 512;

    ctx.save();

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalAlpha = alpha;

    for (let y = -radius; y <= radius; y += stripHeight) {
      const yMid = y + stripHeight / 2;
      const normalizedY = yMid / radius;
      const chord = Math.sqrt(Math.max(0, 1 - normalizedY * normalizedY));
      const destWidth = radius * 2 * chord;
      const destX = center - destWidth / 2;
      const destY = center + y;

      /*
        Projection lock:
        v is derived only from the stable sphere row.
        No pointer dy, latitudeOffset, scale, pull, or gesture movement may change v.
      */
      const v = clamp(0.5 + normalizedY * 0.5, 0, 1);
      const sy = Math.floor(v * (imageHeight - 1));
      const sh = Math.max(1, Math.ceil((stripHeight / (radius * 2)) * imageHeight * 1.8));

      drawWrappedStrip(ctx, image, phase, sy, sh, destX, destY, destWidth, stripHeight + 1);
    }

    ctx.restore();
  }

  function drawFallbackLoading(ctx, state) {
    const size = state.size;
    const center = size / 2;
    const radius = size * 0.405;

    ctx.clearRect(0, 0, size, size);

    const gradient = ctx.createRadialGradient(
      center - radius * 0.28,
      center - radius * 0.24,
      radius * 0.05,
      center,
      center,
      radius
    );

    gradient.addColorStop(0, "#2b86c5");
    gradient.addColorStop(0.58, "#105b96");
    gradient.addColorStop(1, "#071f58");

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  function drawShading(ctx, state) {
    const size = state.size;
    const center = size / 2;
    const zoom = clamp(state.zoom, state.options.minZoom, state.options.maxZoom);
    const radius = size * 0.405 * zoom;

    ctx.save();

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.clip();

    const daylight = ctx.createRadialGradient(
      center - radius * 0.38,
      center - radius * 0.34,
      radius * 0.02,
      center,
      center,
      radius * 1.18
    );

    daylight.addColorStop(0, "rgba(255,255,255,0.28)");
    daylight.addColorStop(0.32, "rgba(255,255,255,0.08)");
    daylight.addColorStop(0.68, "rgba(0,0,0,0.10)");
    daylight.addColorStop(1, "rgba(0,0,0,0.48)");

    ctx.fillStyle = daylight;
    ctx.fillRect(center - radius, center - radius, radius * 2, radius * 2);

    const terminator = ctx.createLinearGradient(center - radius, center, center + radius, center);
    terminator.addColorStop(0, "rgba(255,255,255,0.05)");
    terminator.addColorStop(0.44, "rgba(255,255,255,0.00)");
    terminator.addColorStop(0.72, "rgba(0,0,0,0.14)");
    terminator.addColorStop(1, "rgba(0,0,0,0.34)");

    ctx.fillStyle = terminator;
    ctx.fillRect(center - radius, center - radius, radius * 2, radius * 2);

    const edge = ctx.createRadialGradient(center, center, radius * 0.68, center, center, radius);
    edge.addColorStop(0, "rgba(0,0,0,0)");
    edge.addColorStop(0.78, "rgba(0,0,0,0.08)");
    edge.addColorStop(1, "rgba(0,0,0,0.36)");

    ctx.fillStyle = edge;
    ctx.fillRect(center - radius, center - radius, radius * 2, radius * 2);

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

    drawTextureSphere(ctx, state, surfaceImage, state.surfacePhase, 1);
    drawTextureSphere(ctx, state, cloudImage, state.cloudPhase, 0.36);
    drawShading(ctx, state);

    canvas.dataset.surfacePhase = state.surfacePhase.toFixed(5);
    canvas.dataset.cloudPhase = state.cloudPhase.toFixed(5);
    canvas.dataset.zoom = state.zoom.toFixed(3);
    canvas.dataset.rotationModel = "surface-longitude-phase";
    canvas.dataset.touchModel = "horizontal-drag-only";
    canvas.dataset.textureStretch = "forbidden";
    canvas.dataset.verticalDragTextureEffect = "disabled";
    canvas.dataset.projectionSampling = "locked";
  }

  function setStatusDataset(mount, state) {
    if (!mount) return;

    mount.dataset.body = EARTH.id;
    mount.dataset.earthAuthority = EARTH.authority;
    mount.dataset.version = VERSION;
    mount.dataset.generation = EARTH.generation;
    mount.dataset.canvasBoundary = "fixed";
    mount.dataset.sphereMask = "fixed";
    mount.dataset.objectBoundary = "natural-sphere-mask";
    mount.dataset.projectionSampling = "locked";
    mount.dataset.rotationModel = "surface-longitude-phase";
    mount.dataset.touchModel = "horizontal-drag-only";
    mount.dataset.diskRotation = "forbidden";
    mount.dataset.textureStretch = "forbidden";
    mount.dataset.verticalDragTextureEffect = "disabled";
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

      if (event.cancelable) event.preventDefault();
    }

    function onPointerMove(event) {
      if (!state.dragging) return;

      const point = pointerPoint(event);
      const dx = point.x - state.lastX;

      /*
        Critical v2 law:
        dy is intentionally ignored.
        No vertical pointer movement may alter texture sampling, canvas scale,
        sphere row selection, latitude offset, radius, strip height, or object transform.
      */
      state.lastX = point.x;
      state.lastY = point.y;

      const longitudeDelta = -dx * state.options.dragLongitudeFactor;

      state.surfacePhase = wrap01(state.surfacePhase + longitudeDelta);
      state.cloudPhase = wrap01(state.cloudPhase + longitudeDelta * 0.44);
      state.velocityX = longitudeDelta * 0.58;

      renderFrame(state);
      setStatusDataset(state.mount, state);

      if (event.cancelable) event.preventDefault();
    }

    function onPointerUp() {
      state.dragging = false;
      canvas.dataset.dragging = "false";
    }

    function onWheel(event) {
      const delta = event.deltaY > 0 ? -0.035 : 0.035;
      state.zoom = clamp(state.zoom + delta, state.options.minZoom, state.options.maxZoom);
      renderFrame(state);
      setStatusDataset(state.mount, state);

      if (event.cancelable) event.preventDefault();
    }

    canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    state.cleanup.push(function () {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
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
    receipt.dataset.touchModel = "horizontal-drag-only";
    receipt.dataset.diskRotation = "forbidden";
    receipt.dataset.textureStretch = "forbidden";
    receipt.dataset.verticalDragTextureEffect = "disabled";
    receipt.dataset.projectionSampling = "locked";
    receipt.dataset.publicReceipts = "hidden";
    receipt.textContent =
      "EARTH_G4_TOUCH_ROTATION_NO_STRETCH_CONTROL_TNT_v2 surface_phase_rotation=active horizontal_drag_only=true texture_stretch=forbidden visual_pass=held";

    if (mount) mount.appendChild(receipt);
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

  function createInstance(mountTarget, options) {
    const target =
      typeof mountTarget === "string"
        ? document.querySelector(mountTarget)
        : mountTarget && mountTarget.nodeType === 1
          ? mountTarget
          : document.getElementById("earthRenderMount");

    if (!target) return null;

    const previous = instanceStore.get(target);
    if (previous && typeof previous.destroy === "function") {
      previous.destroy();
    }

    const normalizedOptions = normalizeOptions(options);
    const canvas = createCanvas();
    const ctx = canvas.getContext("2d", { alpha: true });

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
      surfacePhase: wrap01(normalizedOptions.initialPhase),
      cloudPhase: wrap01(normalizedOptions.initialCloudPhase),
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

    if (normalizedOptions.renderReceipt) {
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
      state.surfacePhase = normalizedOptions.initialPhase;
      state.cloudPhase = normalizedOptions.initialCloudPhase;
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
        zoom: state.zoom,
        running: state.running,
        dragging: state.dragging,
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

  function renderEarth(mountTarget, options) {
    return createInstance(mountTarget, options);
  }

  function renderSurface(mountTarget, options) {
    return renderEarth(mountTarget, options);
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
      surfacePhase: wrap01(normalizeNumber(config.phase, DEFAULTS.initialPhase)),
      cloudPhase: wrap01(normalizeNumber(config.cloudPhase, DEFAULTS.initialCloudPhase)),
      velocityX: 0,
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
        sphereMask: EARTH.sphereMask,
        objectBoundary: EARTH.objectBoundary,
        projectionSampling: EARTH.projectionSampling,
        rotationModel: EARTH.rotationModel,
        touchModel: EARTH.touchModel,
        surfacePhaseRotation: "active",
        cloudPhaseRotation: "active",
        diskRotation: "forbidden",
        textureStretch: "forbidden",
        verticalDragTextureEffect: "disabled",
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
          "EARTH_TOUCH_ROTATION_HORIZONTAL_ONLY_TEXTURE_STRETCH_FORBIDDEN_PROJECTION_LOCKED"
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
          touchModel: EARTH.touchModel,
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
