/*
  /assets/earth/earth_canvas.js
  EARTH_G4_ASSET_RESPONSIBILITY_SPLIT_AND_MATERIAL_RESTORE_TNT_v2

  Full-file replacement.

  Scope:
  - Earth canvas/source authority only.
  - Loads manifest as truth map with deep fallback merge.
  - Ensures Earth material CSS is available but does not own material styling.
  - Uses surface image as surface authority.
  - Uses PNG cloud layer first, JPG cloud layer as fallback.
  - Controls fixed canvas, fixed sphere projection, surface-phase rotation, cloud-phase rotation, horizontal touch rotation, and inertia.
  - Forbids disk rotation, texture stretch, whole-canvas transform, vertical drag deformation, GraphicBox, image generation, and visual-pass claims.
*/

(function () {
  "use strict";

  const VERSION = "EARTH_G4_ASSET_RESPONSIBILITY_SPLIT_AND_MATERIAL_RESTORE_TNT_v2";
  const PREVIOUS_VERSION = "EARTH_G4_ASSET_RESPONSIBILITY_SPLIT_AND_MATERIAL_RESTORE_TNT_v1";

  const FALLBACK_MANIFEST = Object.freeze({
    body: "earth",
    label: "Earth",
    route: "/showroom/globe/earth/",
    authority: "/assets/earth/earth_canvas.js",
    generation: "G4_REFERENCE_BODY_SURFACE_PHASE_ROTATION",
    reference_standard: "NASA_BLUE_MARBLE_REFERENCE_DISCIPLINE",
    active_assets: {
      surface: "/assets/earth/earth_surface_2048.jpg",
      clouds_primary: "/assets/earth/earth_clouds_2048.png",
      clouds_fallback: "/assets/earth/earth_clouds_2048.jpg",
      material: "/assets/earth/earth_material.css",
      canvas: "/assets/earth/earth_canvas.js",
      fallback_svg: "/assets/earth/earth.svg"
    }
  });

  const DEFAULTS = Object.freeze({
    maxDevicePixelRatio: 2,
    surfaceAutoStep: 0.00062,
    cloudAutoStep: 0.00027,
    dragLongitudeFactor: 0.00175,
    releaseFriction: 0.95,
    minVelocity: 0.000018,
    minZoom: 0.9,
    maxZoom: 1.2,
    initialZoom: 1,
    initialPhase: 0.18,
    initialCloudPhase: 0.08
  });

  const imageCache = Object.create(null);
  const instanceStore = new WeakMap();

  let manifestPromise = null;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function number(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function mergeManifest(manifest) {
    const json = manifest && typeof manifest === "object" ? manifest : {};

    return Object.assign({}, FALLBACK_MANIFEST, json, {
      active_assets: Object.assign(
        {},
        FALLBACK_MANIFEST.active_assets,
        json.active_assets && typeof json.active_assets === "object" ? json.active_assets : {}
      )
    });
  }

  function safeDispatch(name, detail) {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    } catch (error) {
      try {
        const event = document.createEvent("CustomEvent");
        event.initCustomEvent(name, false, false, detail);
        window.dispatchEvent(event);
      } catch (ignored) {}
    }
  }

  function exposeReceipt(extra) {
    window.DGB_EARTH_G4_ASSET_RECEIPT = Object.assign(
      {
        contract: VERSION,
        previousContract: PREVIOUS_VERSION,
        route: "/showroom/globe/earth/",
        authority: "/assets/earth/earth_canvas.js",
        body: "earth",
        label: "Earth",
        generation: "G4_REFERENCE_BODY_SURFACE_PHASE_ROTATION",
        referenceStandard: "NASA_BLUE_MARBLE_REFERENCE_DISCIPLINE",
        owns: [
          "earth_canvas_projection",
          "earth_surface_phase_rotation",
          "earth_cloud_phase_rotation",
          "earth_horizontal_touch_rotation",
          "earth_inertia",
          "earth_asset_manifest_loading",
          "earth_hidden_receipt"
        ],
        doesNotOwn: [
          "Audralia",
          "Showroom selector",
          "Showroom CSS",
          "Gauges",
          "Products",
          "Sun",
          "Moon",
          "global files",
          "material styling",
          "image generation",
          "GraphicBox"
        ],
        canvasBoundary: "fixed",
        sphereMask: "fixed",
        projectionSampling: "locked",
        diskRotation: "forbidden",
        textureStretch: "forbidden",
        verticalDragTextureEffect: "disabled",
        wholeCanvasTransform: "forbidden",
        wholeObjectRotation: "forbidden",
        generatedImage: false,
        graphicBox: false,
        visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION",
        visualPassClaimed: false,
        timestamp: new Date().toISOString()
      },
      extra || {}
    );

    document.documentElement.dataset.earthG4AssetReceipt = VERSION;
    document.documentElement.dataset.earthCanvasAuthority = "/assets/earth/earth_canvas.js";
    document.documentElement.dataset.earthMaterialAuthority = "/assets/earth/earth_material.css";
    document.documentElement.dataset.earthGeneratedImage = "false";
    document.documentElement.dataset.earthGraphicBox = "false";
    document.documentElement.dataset.earthVisualPassClaimed = "false";
  }

  function loadManifest() {
    if (manifestPromise) return manifestPromise;

    manifestPromise = fetch("/assets/earth/earth_manifest.json", { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("manifest unavailable");
        return response.json();
      })
      .then(function (json) {
        return mergeManifest(json);
      })
      .catch(function () {
        return mergeManifest(FALLBACK_MANIFEST);
      });

    return manifestPromise;
  }

  function ensureMaterialStylesheet(manifest) {
    const merged = mergeManifest(manifest);
    const path = merged.active_assets.material || FALLBACK_MANIFEST.active_assets.material;

    if (!path) return;

    const existing = document.querySelector('link[data-earth-material-css="true"]');
    if (existing) {
      existing.dataset.contract = VERSION;
      existing.dataset.previousContract = PREVIOUS_VERSION;
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = path + "?v=" + encodeURIComponent(VERSION);
    link.dataset.earthMaterialCss = "true";
    link.dataset.contract = VERSION;
    link.dataset.previousContract = PREVIOUS_VERSION;
    link.dataset.authority = path;
    document.head.appendChild(link);
  }

  function loadImage(src) {
    if (!src || typeof src !== "string") {
      return Promise.resolve({
        ok: false,
        src: "",
        image: null,
        width: 0,
        height: 0,
        reason: "missing-src"
      });
    }

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
          height: 0,
          reason: "load-error"
        });
      };

      image.src = src;
    });

    return imageCache[src];
  }

  function createFallbackTexture(width, height, variant) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = variant === "clouds" ? "rgba(255,255,255,0)" : "#0d4f8f";
    ctx.fillRect(0, 0, width, height);

    function blob(cx, cy, rx, ry, color) {
      ctx.beginPath();

      for (let i = 0; i <= 72; i += 1) {
        const a = (Math.PI * 2 * i) / 72;
        const wobble = 1 + Math.sin(a * 3 + cx * 0.01) * 0.08 + Math.sin(a * 7) * 0.04;
        const x = cx + Math.cos(a) * rx * wobble;
        const y = cy + Math.sin(a) * ry * wobble;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    if (variant === "clouds") {
      for (let i = 0; i < 32; i += 1) {
        blob(
          (i * 173) % width,
          (i * 91) % height,
          58 + (i % 5) * 18,
          14 + (i % 3) * 7,
          i % 2 ? "rgba(255,255,255,0.46)" : "rgba(255,255,255,0.30)"
        );
      }
    } else {
      blob(width * 0.23, height * 0.48, width * 0.14, height * 0.24, "#3f8c58");
      blob(width * 0.42, height * 0.43, width * 0.14, height * 0.17, "#b58d57");
      blob(width * 0.58, height * 0.49, width * 0.17, height * 0.20, "#3f8c58");
      blob(width * 0.75, height * 0.46, width * 0.12, height * 0.16, "#b58d57");

      ctx.fillStyle = "rgba(238,245,248,0.88)";
      ctx.fillRect(0, 0, width, height * 0.07);
      ctx.fillRect(0, height * 0.93, width, height * 0.07);
    }

    return canvas;
  }

  function createProfile(overrides) {
    return Object.assign(
      {
        id: "earth",
        label: "Earth",
        route: "/showroom/globe/earth/",
        authority: "/assets/earth/earth_canvas.js",
        version: VERSION,
        previousVersion: PREVIOUS_VERSION,
        generation: "G4_REFERENCE_BODY_SURFACE_PHASE_ROTATION",
        referenceStandard: "NASA_BLUE_MARBLE_REFERENCE_DISCIPLINE",
        canvasBoundary: "fixed",
        sphereMask: "fixed",
        objectBoundary: "natural-sphere-mask",
        projectionSampling: "locked",
        rotationModel: "surface-longitude-phase",
        touchModel: "horizontal-drag-only",
        diskRotation: "forbidden",
        textureStretch: "forbidden",
        verticalDragTextureEffect: "disabled",
        wholeCanvasTransform: "forbidden",
        wholeObjectRotation: "forbidden",
        surfaceAuthority: "/assets/earth/earth_surface_2048.jpg",
        cloudAuthority: "/assets/earth/earth_clouds_2048.png",
        materialAuthority: "/assets/earth/earth_material.css",
        manifestAuthority: "/assets/earth/earth_manifest.json",
        generatedImage: false,
        graphicBox: false,
        visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION",
        visualPassClaimed: false
      },
      overrides || {}
    );
  }

  function createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.className = "earth-g4-canvas earth-material-canvas earth-reference-canvas";
    canvas.dataset.body = "earth";
    canvas.dataset.authority = "/assets/earth/earth_canvas.js";
    canvas.dataset.version = VERSION;
    canvas.dataset.previousVersion = PREVIOUS_VERSION;
    canvas.dataset.rotationModel = "surface-longitude-phase";
    canvas.dataset.touchModel = "horizontal-drag-only";
    canvas.dataset.diskRotation = "forbidden";
    canvas.dataset.textureStretch = "forbidden";
    canvas.dataset.verticalDragTextureEffect = "disabled";
    canvas.dataset.wholeCanvasTransform = "forbidden";
    canvas.dataset.projectionSampling = "locked";
    canvas.dataset.materialAuthority = "/assets/earth/earth_material.css";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.visualPassClaimed = "false";
    canvas.dataset.publicReceipts = "hidden";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Earth G4 reference globe with surface-phase rotation");
    canvas.style.transform = "none";
    canvas.style.touchAction = "none";
    return canvas;
  }

  function createFrame(canvas) {
    const frame = document.createElement("div");
    frame.className = "earth-material-frame";
    frame.dataset.earthMaterialFrame = "true";
    frame.dataset.contract = VERSION;
    frame.dataset.previousContract = PREVIOUS_VERSION;
    frame.appendChild(canvas);
    return frame;
  }

  function createLabel() {
    const label = document.createElement("div");
    label.className = "earth-reference-label";
    label.textContent = "NASA BLUE MARBLE REFERENCE";
    label.setAttribute("aria-hidden", "true");
    return label;
  }

  function resize(canvas, mount, state) {
    const rect = mount && mount.getBoundingClientRect ? mount.getBoundingClientRect() : null;
    const available = rect && rect.width ? rect.width : window.innerWidth - 32;
    const cssSize = Math.max(280, Math.min(660, Math.floor(available * 0.92)));
    const dpr = Math.min(DEFAULTS.maxDevicePixelRatio, Math.max(1, window.devicePixelRatio || 1));
    const px = Math.max(320, Math.floor(cssSize * dpr));

    if (canvas.width !== px || canvas.height !== px) {
      canvas.width = px;
      canvas.height = px;
    }

    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

    state.size = px;
    state.cssSize = cssSize;
  }

  function drawWrappedStrip(ctx, image, phase, sy, sh, dx, dy, dw, dh) {
    if (!image || !image.width || !image.height || dw <= 0 || dh <= 0) return;

    const iw = image.width;
    const ih = image.height;
    const start = wrap01(phase) * iw;
    const safeSy = clamp(sy, 0, ih - 1);
    const safeSh = clamp(sh, 1, ih - safeSy);
    const firstSourceWidth = iw - start;
    const firstDestWidth = dw * (firstSourceWidth / iw);
    const secondDestWidth = dw - firstDestWidth;

    ctx.drawImage(image, start, safeSy, firstSourceWidth, safeSh, dx, dy, firstDestWidth, dh);

    if (secondDestWidth > 0.5) {
      ctx.drawImage(image, 0, safeSy, start, safeSh, dx + firstDestWidth, dy, secondDestWidth, dh);
    }
  }

  function drawTextureSphere(ctx, state, image, phase, alpha) {
    const size = state.size;
    const center = size / 2;
    const radius = size * 0.405 * clamp(state.zoom, state.options.minZoom, state.options.maxZoom);
    const stripHeight = Math.max(1, Math.floor(size / 420));
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
      const v = clamp(0.5 + normalizedY * 0.5, 0, 1);
      const sy = Math.floor(v * (imageHeight - 1));
      const sh = Math.max(1, Math.ceil((stripHeight / (radius * 2)) * imageHeight * 1.9));

      drawWrappedStrip(ctx, image, phase, sy, sh, destX, destY, destWidth, stripHeight + 1);
    }

    ctx.restore();
  }

  function drawAtmosphereAndLight(ctx, state) {
    const size = state.size;
    const center = size / 2;
    const radius = size * 0.405 * clamp(state.zoom, state.options.minZoom, state.options.maxZoom);

    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.clip();

    const light = ctx.createRadialGradient(
      center - radius * 0.36,
      center - radius * 0.34,
      radius * 0.03,
      center,
      center,
      radius * 1.16
    );

    light.addColorStop(0, "rgba(255,255,255,0.24)");
    light.addColorStop(0.34, "rgba(255,255,255,0.07)");
    light.addColorStop(0.70, "rgba(0,0,0,0.10)");
    light.addColorStop(1, "rgba(0,0,0,0.42)");

    ctx.fillStyle = light;
    ctx.fillRect(center - radius, center - radius, radius * 2, radius * 2);

    const rim = ctx.createRadialGradient(center, center, radius * 0.78, center, center, radius);
    rim.addColorStop(0, "rgba(0,0,0,0)");
    rim.addColorStop(0.82, "rgba(6,28,54,0.08)");
    rim.addColorStop(1, "rgba(6,24,42,0.34)");

    ctx.fillStyle = rim;
    ctx.fillRect(center - radius, center - radius, radius * 2, radius * 2);

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(188,223,255,0.34)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();
    ctx.restore();
  }

  function drawFrame(state) {
    const canvas = state.canvas;
    const ctx = state.ctx;

    resize(canvas, state.mount, state);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const surface =
      state.surface.ok && state.surface.image
        ? state.surface.image
        : state.fallbackSurface;

    const clouds =
      state.cloudsPrimary.ok && state.cloudsPrimary.image
        ? state.cloudsPrimary.image
        : state.cloudsFallback.ok && state.cloudsFallback.image
          ? state.cloudsFallback.image
          : state.fallbackClouds;

    drawTextureSphere(ctx, state, surface, state.surfacePhase, 1);
    drawTextureSphere(ctx, state, clouds, state.cloudPhase, state.cloudsPrimary.ok ? 0.42 : 0.30);
    drawAtmosphereAndLight(ctx, state);

    canvas.dataset.surfacePhase = state.surfacePhase.toFixed(5);
    canvas.dataset.cloudPhase = state.cloudPhase.toFixed(5);
    canvas.dataset.zoom = state.zoom.toFixed(3);
  }

  function setDatasets(mount, state) {
    if (!mount) return;

    const assets =
      state && state.manifest && state.manifest.active_assets
        ? state.manifest.active_assets
        : FALLBACK_MANIFEST.active_assets;

    mount.classList.add("earth-material-stage");
    mount.dataset.body = "earth";
    mount.dataset.version = VERSION;
    mount.dataset.previousVersion = PREVIOUS_VERSION;
    mount.dataset.manifestAuthority = "/assets/earth/earth_manifest.json";
    mount.dataset.materialAuthority = assets.material || FALLBACK_MANIFEST.active_assets.material;
    mount.dataset.canvasAuthority = assets.canvas || FALLBACK_MANIFEST.active_assets.canvas;
    mount.dataset.surfaceAuthority = assets.surface || FALLBACK_MANIFEST.active_assets.surface;
    mount.dataset.cloudAuthority = assets.clouds_primary || FALLBACK_MANIFEST.active_assets.clouds_primary;
    mount.dataset.cloudFallbackAuthority = assets.clouds_fallback || FALLBACK_MANIFEST.active_assets.clouds_fallback;
    mount.dataset.rotationModel = "surface-longitude-phase";
    mount.dataset.touchModel = "horizontal-drag-only";
    mount.dataset.textureStretch = "forbidden";
    mount.dataset.diskRotation = "forbidden";
    mount.dataset.wholeCanvasTransform = "forbidden";
    mount.dataset.projectionSampling = "locked";
    mount.dataset.generatedImage = "false";
    mount.dataset.graphicBox = "false";
    mount.dataset.visualPassClaimed = "false";
    mount.dataset.publicReceipts = "hidden";

    if (state) {
      mount.dataset.surfacePhase = state.surfacePhase.toFixed(5);
      mount.dataset.cloudPhase = state.cloudPhase.toFixed(5);
    }
  }

  function attachControls(state) {
    const canvas = state.canvas;

    function point(event) {
      const source = event.touches && event.touches[0] ? event.touches[0] : event;
      return { x: source.clientX, y: source.clientY };
    }

    function down(event) {
      const p = point(event);
      state.dragging = true;
      state.lastX = p.x;
      state.lastY = p.y;
      state.velocityX = 0;
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
      state.lastY = p.y;

      const delta = -dx * state.options.dragLongitudeFactor;

      state.surfacePhase = wrap01(state.surfacePhase + delta);
      state.cloudPhase = wrap01(state.cloudPhase + delta * 0.44);
      state.velocityX = delta * 0.58;

      drawFrame(state);
      setDatasets(state.mount, state);

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

  function attachResize(state) {
    function onResize() {
      drawFrame(state);
      setDatasets(state.mount, state);
    }

    window.addEventListener("resize", onResize, { passive: true });

    state.cleanup.push(function () {
      window.removeEventListener("resize", onResize);
    });
  }

  function tick(state) {
    if (!state.running) return;

    state.surfacePhase = wrap01(state.surfacePhase + state.options.surfaceAutoStep + state.velocityX);
    state.cloudPhase = wrap01(state.cloudPhase + state.options.cloudAutoStep + state.velocityX * 0.42);
    state.velocityX *= state.options.releaseFriction;

    if (Math.abs(state.velocityX) < state.options.minVelocity) {
      state.velocityX = 0;
    }

    drawFrame(state);
    setDatasets(state.mount, state);

    state.raf = window.requestAnimationFrame(function () {
      tick(state);
    });
  }

  function hiddenReceipt() {
    const node = document.createElement("div");
    node.hidden = true;
    node.setAttribute("aria-hidden", "true");
    node.className = "earth-g4-hidden-receipt";
    node.dataset.contract = VERSION;
    node.dataset.previousContract = PREVIOUS_VERSION;
    node.dataset.manifest = "/assets/earth/earth_manifest.json";
    node.dataset.material = "/assets/earth/earth_material.css";
    node.dataset.canvas = "/assets/earth/earth_canvas.js";
    node.dataset.surface = "/assets/earth/earth_surface_2048.jpg";
    node.dataset.clouds = "/assets/earth/earth_clouds_2048.png";
    node.dataset.rotationModel = "surface-longitude-phase";
    node.dataset.textureStretch = "forbidden";
    node.dataset.diskRotation = "forbidden";
    node.dataset.generatedImage = "false";
    node.dataset.graphicBox = "false";
    node.dataset.visualPassClaimed = "false";
    node.textContent =
      "EARTH_G4_ASSET_RESPONSIBILITY_SPLIT_AND_MATERIAL_RESTORE_TNT_v2 visual_pass=held graphic_box=false generated_image=false";
    return node;
  }

  function normalizeOptions(options) {
    const input = options || {};

    return {
      size: input.size,
      surfaceAutoStep: number(input.surfaceAutoStep, DEFAULTS.surfaceAutoStep),
      cloudAutoStep: number(input.cloudAutoStep, DEFAULTS.cloudAutoStep),
      dragLongitudeFactor: number(input.dragLongitudeFactor, DEFAULTS.dragLongitudeFactor),
      releaseFriction: number(input.releaseFriction, DEFAULTS.releaseFriction),
      minVelocity: number(input.minVelocity, DEFAULTS.minVelocity),
      minZoom: number(input.minZoom, DEFAULTS.minZoom),
      maxZoom: number(input.maxZoom, DEFAULTS.maxZoom),
      initialZoom: number(input.initialZoom, DEFAULTS.initialZoom),
      initialPhase: number(input.initialPhase, DEFAULTS.initialPhase),
      initialCloudPhase: number(input.initialCloudPhase, DEFAULTS.initialCloudPhase)
    };
  }

  function createInstance(mountTarget, options) {
    const target =
      typeof mountTarget === "string"
        ? document.querySelector(mountTarget)
        : mountTarget && mountTarget.nodeType === 1
          ? mountTarget
          : document.getElementById("earthRenderMount");

    if (!target) return null;

    const existing = instanceStore.get(target);
    if (existing && typeof existing.destroy === "function") {
      existing.destroy();
    }

    const normalized = normalizeOptions(options);
    const canvas = createCanvas();
    const frame = createFrame(canvas);
    const label = createLabel();
    const ctx = canvas.getContext("2d", { alpha: true });

    const state = {
      mount: target,
      canvas,
      frame,
      ctx,
      options: normalized,
      size: 0,
      cssSize: 0,
      running: false,
      dragging: false,
      raf: 0,
      surfacePhase: wrap01(normalized.initialPhase),
      cloudPhase: wrap01(normalized.initialCloudPhase),
      velocityX: 0,
      zoom: clamp(normalized.initialZoom, normalized.minZoom, normalized.maxZoom),
      manifest: mergeManifest(FALLBACK_MANIFEST),
      surface: { ok: false, image: null },
      cloudsPrimary: { ok: false, image: null },
      cloudsFallback: { ok: false, image: null },
      fallbackSurface: createFallbackTexture(1024, 512, "surface"),
      fallbackClouds: createFallbackTexture(1024, 512, "clouds"),
      cleanup: []
    };

    target.replaceChildren();
    target.appendChild(frame);
    target.appendChild(label);
    target.appendChild(hiddenReceipt());

    setDatasets(target, state);
    attachControls(state);
    attachResize(state);
    drawFrame(state);

    loadManifest().then(function (manifest) {
      state.manifest = mergeManifest(manifest);
      ensureMaterialStylesheet(state.manifest);

      const assets = state.manifest.active_assets || FALLBACK_MANIFEST.active_assets;

      Promise.all([
        loadImage(assets.surface),
        loadImage(assets.clouds_primary),
        loadImage(assets.clouds_fallback)
      ]).then(function (results) {
        state.surface = results[0];
        state.cloudsPrimary = results[1];
        state.cloudsFallback = results[2];

        target.dataset.surfaceAssetLoaded = String(Boolean(state.surface.ok));
        target.dataset.cloudPrimaryLoaded = String(Boolean(state.cloudsPrimary.ok));
        target.dataset.cloudFallbackLoaded = String(Boolean(state.cloudsFallback.ok));

        setDatasets(target, state);
        drawFrame(state);

        exposeReceipt({
          manifestLoaded: true,
          materialAuthority: assets.material,
          surfaceAuthority: assets.surface,
          cloudAuthority: assets.clouds_primary,
          cloudFallbackAuthority: assets.clouds_fallback,
          surfaceAssetLoaded: Boolean(state.surface.ok),
          cloudPrimaryLoaded: Boolean(state.cloudsPrimary.ok),
          cloudFallbackLoaded: Boolean(state.cloudsFallback.ok)
        });
      });
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
      state.surfacePhase = normalized.initialPhase;
      state.cloudPhase = normalized.initialCloudPhase;
      state.velocityX = 0;
      state.zoom = normalized.initialZoom;
      drawFrame(state);
      setDatasets(target, state);
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
        running: state.running,
        dragging: state.dragging,
        surfaceAssetLoaded: Boolean(state.surface.ok),
        cloudPrimaryLoaded: Boolean(state.cloudsPrimary.ok),
        cloudFallbackLoaded: Boolean(state.cloudsFallback.ok)
      });
    }

    const api = Object.freeze({
      mount: target,
      canvas,
      start,
      stop,
      reset,
      destroy,
      getStatus: status
    });

    instanceStore.set(target, api);
    start();

    exposeReceipt({
      mounted: true,
      mountDetected: true
    });

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
    const canvas = createCanvas();
    const holder = document.createElement("div");
    holder.style.position = "fixed";
    holder.style.left = "-99999px";
    holder.style.top = "-99999px";
    holder.style.width = "640px";
    holder.style.height = "640px";
    holder.appendChild(canvas);

    const state = {
      mount: holder,
      canvas,
      ctx: canvas.getContext("2d", { alpha: true }),
      options: normalizeOptions(options),
      size: 640,
      cssSize: 640,
      surfacePhase: wrap01(number(options && options.phase, DEFAULTS.initialPhase)),
      cloudPhase: wrap01(number(options && options.cloudPhase, DEFAULTS.initialCloudPhase)),
      velocityX: 0,
      zoom: 1,
      surface: { ok: false, image: null },
      cloudsPrimary: { ok: false, image: null },
      cloudsFallback: { ok: false, image: null },
      fallbackSurface: createFallbackTexture(1024, 512, "surface"),
      fallbackClouds: createFallbackTexture(1024, 512, "clouds")
    };

    canvas.width = 640;
    canvas.height = 640;
    drawFrame(state);

    if (options && options.returnObject === true) {
      return { canvas, version: VERSION, profile: createProfile(), status: getStatus() };
    }

    return canvas;
  }

  function verifyAssets() {
    return loadManifest().then(function (manifest) {
      const merged = mergeManifest(manifest);
      const assets = merged.active_assets || FALLBACK_MANIFEST.active_assets;

      return Promise.all([
        loadImage(assets.surface),
        loadImage(assets.clouds_primary),
        loadImage(assets.clouds_fallback)
      ]).then(function (results) {
        return {
          version: VERSION,
          previousVersion: PREVIOUS_VERSION,
          manifest: "/assets/earth/earth_manifest.json",
          material: assets.material,
          surface: {
            path: assets.surface,
            ok: Boolean(results[0] && results[0].ok),
            width: results[0] ? results[0].width : 0,
            height: results[0] ? results[0].height : 0
          },
          cloudsPrimary: {
            path: assets.clouds_primary,
            ok: Boolean(results[1] && results[1].ok),
            width: results[1] ? results[1].width : 0,
            height: results[1] ? results[1].height : 0
          },
          cloudsFallback: {
            path: assets.clouds_fallback,
            ok: Boolean(results[2] && results[2].ok),
            width: results[2] ? results[2].width : 0,
            height: results[2] ? results[2].height : 0
          },
          generatedImage: false,
          graphicBox: false,
          visualPassClaimed: false
        };
      });
    });
  }

  function getStatus(extra) {
    return Object.assign(
      {
        version: VERSION,
        previousVersion: PREVIOUS_VERSION,
        body: "earth",
        label: "Earth",
        route: "/showroom/globe/earth/",
        authority: "/assets/earth/earth_canvas.js",
        manifestAuthority: "/assets/earth/earth_manifest.json",
        materialAuthority: "/assets/earth/earth_material.css",
        surfaceAuthority: "/assets/earth/earth_surface_2048.jpg",
        cloudAuthority: "/assets/earth/earth_clouds_2048.png",
        generation: "G4_REFERENCE_BODY_SURFACE_PHASE_ROTATION",
        rotationModel: "surface-longitude-phase",
        touchModel: "horizontal-drag-only",
        canvasBoundary: "fixed",
        sphereMask: "fixed",
        objectBoundary: "natural-sphere-mask",
        projectionSampling: "locked",
        diskRotation: "forbidden",
        textureStretch: "forbidden",
        verticalDragTextureEffect: "disabled",
        wholeCanvasTransform: "forbidden",
        wholeObjectRotation: "forbidden",
        generatedImage: false,
        graphicBox: false,
        visualPass: "HELD_UNTIL_SCREENSHOT_OR_OWNER_CONFIRMATION",
        visualPassClaimed: false,
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
          "EARTH_G4_RESPONSIBILITY_SPLIT_ACTIVE_CANVAS_CONTROLS_MOTION_MATERIAL_CONTROLS_GLOW_IMAGES_CONTROL_SOURCE"
      },
      extra || {}
    );
  }

  function registerExtension(target) {
    if (!target || typeof target !== "object") return window.DGBEarthCanvas;

    if (typeof target.registerRenderer === "function") {
      target.registerRenderer("earth", window.DGBEarthCanvas);
    }

    if (typeof target.registerPlanet === "function") {
      target.registerPlanet(createProfile(), window.DGBEarthCanvas);
    }

    if (typeof target.registerExtension === "function") {
      target.registerExtension("earth", window.DGBEarthCanvas);
    }

    if (target.extensions && typeof target.extensions === "object") {
      target.extensions.earth = window.DGBEarthCanvas;
    }

    if (target.planets && typeof target.planets === "object") {
      target.planets.earth = createProfile();
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

    exposeReceipt({
      autoRegistered: true
    });

    safeDispatch("dgb:earth-canvas-ready", {
      body: "earth",
      label: "Earth",
      version: VERSION,
      previousVersion: PREVIOUS_VERSION,
      api: window.DGBEarthCanvas,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function autoMount() {
    const target =
      document.getElementById("earthRenderMount") ||
      document.querySelector("[data-earth-render-mount]") ||
      document.querySelector("[data-body='earth'][data-render-mount]");

    if (!target) return;

    renderEarth(target);
  }

  const api = Object.freeze({
    version: VERSION,
    previousVersion: PREVIOUS_VERSION,
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

  exposeReceipt({
    booted: true,
    mounted: false
  });

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
