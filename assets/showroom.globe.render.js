/* /assets/showroom.globe.render.js
   ADRALIA_MOON_DISPATCH_AND_LUNAR_SURFACE_CORRECTION_TNT_v1

   ROLE=
   SHARED_RENDER_PLATFORM

   RENEWAL=
   Hard-stop wrong-body fallback.
   If activeBody=audrelia-moon, only the Adralia Moon extension may draw.
   If the moon extension fails, clear/hold instead of drawing Audrelia.

   OWNS=
   CANVAS_PIPELINE
   ORTHOGRAPHIC_PROJECTION
   LIGHTING_CONTEXT
   EXTENSION_REGISTRY
   ACTIVE_BODY_DISPATCH
   BODY_SWITCH_CLEAR
   RECEIPT_AGGREGATION

   DOES_NOT_OWN=
   BODY_IDENTITY
   BODY_SPECIFIC_SURFACE_LAW
   ROUTE_LABELS
   ROUTE_COPY
   INSTRUMENT_STATE
   GAUGES
*/

(function bindShowroomGlobeRenderPlatform(global) {
  "use strict";

  const VERSION = "ADRALIA_MOON_DISPATCH_AND_LUNAR_SURFACE_CORRECTION_TNT_v1";
  const TAU = Math.PI * 2;
  const PI = Math.PI;
  const DEG = Math.PI / 180;
  const MAX_WORK_SIZE = 1180;

  const extensionRegistry = Object.create(null);
  const aliasRegistry = Object.create(null);
  const loadingRegistry = Object.create(null);

  const EXTENSION_FILES = Object.freeze({
    audrelia: "/assets/audrelia.planet.render.js?v=AUDRELIA_RENDER_EXTENSION_ARCHITECTURE_TNT_v1",
    "audrelia-sun": "/assets/audrelia.sun.render.js?v=AUDRELIA_SUN_EXTENSION_SOLAR_AUTHORITY_RENEWAL_TNT_v1",
    "audrelia-moon": "/assets/audrelia.climate-moon.render.js?v=ADRALIA_MOON_DISPATCH_AND_LUNAR_SURFACE_CORRECTION_TNT_v1"
  });

  const GLOBAL_EXTENSION_NAMES = Object.freeze({
    audrelia: ["DGBAudreliaPlanetRenderExtension"],
    "audrelia-sun": ["DGBAudreliaSunRenderExtension"],
    "audrelia-moon": ["DGBAdraliaMoonRenderExtension", "DGBAudreliaClimateMoonRenderExtension"]
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function wrap01(value) {
    value = Number(value) || 0;
    value = value % 1;
    return value < 0 ? value + 1 : value;
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function makeCanvas(width, height) {
    const canvas = global.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function normalizeBody(value) {
    if (value && typeof value === "object") {
      value = value.activeBody || value.body || value.selectedBody || value.currentBody || value.name || value.value;
    }

    value = String(value || "").trim().toLowerCase();

    if (
      value === "audrelia-moon" ||
      value === "adralia-moon" ||
      value === "adralia’s moon" ||
      value === "adralias-moon" ||
      value === "audrelia-climate-moon" ||
      value === "climate-moon" ||
      value === "manufactured-moon" ||
      value === "moon" ||
      value.includes("moon")
    ) {
      return "audrelia-moon";
    }

    if (
      value === "audrelia-sun" ||
      value === "audrelia’s sun" ||
      value === "audrelias-sun" ||
      value === "sun" ||
      value === "solar-system-sun" ||
      value === "solar-sun" ||
      value.includes("sun")
    ) {
      return "audrelia-sun";
    }

    if (
      value === "audrelia" ||
      value === "audrelia-planet" ||
      value === "earth" ||
      value === "planet" ||
      value.includes("audrelia") ||
      value.includes("earth") ||
      value.includes("planet")
    ) {
      return "audrelia";
    }

    return "audrelia";
  }

  function registerExtension(extension) {
    if (!extension || !extension.id) {
      return {
        ok: false,
        version: VERSION,
        status: "INVALID_EXTENSION"
      };
    }

    const id = normalizeBody(extension.id);

    extensionRegistry[id] = extension;
    aliasRegistry[id] = id;

    if (Array.isArray(extension.aliases)) {
      extension.aliases.forEach(function registerAlias(alias) {
        aliasRegistry[String(alias).trim().toLowerCase()] = id;
      });
    }

    return {
      ok: true,
      version: VERSION,
      status: "EXTENSION_REGISTERED",
      id,
      label: extension.label || id,
      profileMerge: false,
      generatedImage: false,
      visualPassClaimed: false
    };
  }

  function getGlobalExtension(body) {
    const normalized = normalizeBody(body);
    const names = GLOBAL_EXTENSION_NAMES[normalized] || [];

    for (let i = 0; i < names.length; i += 1) {
      const candidate = global[names[i]];

      if (candidate && candidate.id && normalizeBody(candidate.id) === normalized) {
        registerExtension(candidate);
        return candidate;
      }
    }

    return null;
  }

  function findRegisteredExtension(body) {
    const normalized = normalizeBody(body);
    const aliasTarget = aliasRegistry[normalized] || normalized;
    const extension = extensionRegistry[aliasTarget] || getGlobalExtension(aliasTarget);

    if (!extension) return null;

    if (normalizeBody(extension.id) !== normalized) return null;

    return extension;
  }

  function loadExtension(body) {
    const normalized = normalizeBody(body);
    const existing = findRegisteredExtension(normalized);

    if (existing) return Promise.resolve(existing);
    if (loadingRegistry[normalized]) return loadingRegistry[normalized];

    const src = EXTENSION_FILES[normalized];

    if (!src || !global.document) {
      return Promise.reject(new Error("NO_EXTENSION_FILE_FOR_" + normalized));
    }

    loadingRegistry[normalized] = new Promise(function load(resolve, reject) {
      const script = global.document.createElement("script");
      script.src = src;

      script.onload = function onLoad() {
        const loaded = findRegisteredExtension(normalized);

        if (loaded && normalizeBody(loaded.id) === normalized) {
          resolve(loaded);
        } else {
          reject(new Error("EXTENSION_LOADED_BUT_NOT_REGISTERED_FOR_" + normalized));
        }
      };

      script.onerror = function onError() {
        reject(new Error("EXTENSION_LOAD_FAILED_FOR_" + normalized));
      };

      global.document.head.appendChild(script);
    });

    return loadingRegistry[normalized];
  }

  function resolveBody(options, canvas) {
    options = options || {};

    const candidates = [
      options.activeBody,
      options.body,
      options.selectedBody,
      options.currentBody,
      options.model,
      options.type,
      canvas && canvas.dataset && canvas.dataset.activeBody,
      canvas && canvas.dataset && canvas.dataset.body,
      canvas && canvas.getAttribute && canvas.getAttribute("data-active-body"),
      canvas && canvas.getAttribute && canvas.getAttribute("data-body"),
      canvas && canvas.getAttribute && canvas.getAttribute("aria-label")
    ];

    for (let i = 0; i < candidates.length; i += 1) {
      const candidate = candidates[i];

      if (candidate !== undefined && candidate !== null && String(candidate).trim()) {
        return normalizeBody(candidate);
      }
    }

    return "audrelia";
  }

  function resizeCanvas(canvas) {
    const host = canvas.parentElement || canvas;
    const rect = host.getBoundingClientRect();
    const cssSize = clamp(Math.round(rect.width || canvas.clientWidth || 420), 260, 1700);
    const dpr = clamp(global.devicePixelRatio || 1, 1, 3);
    const pixelSize = Math.round(cssSize * dpr);

    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.borderRadius = "50%";

    if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
      canvas.width = pixelSize;
      canvas.height = pixelSize;
    }

    return {
      cssSize,
      pixelSize,
      dpr
    };
  }

  function clearCanvas(canvas) {
    const ctx = canvas.getContext("2d", { alpha: true });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function writeCanvasHold(canvas, body, status) {
    const ctx = canvas.getContext("2d", { alpha: true });
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.dataset.renderHold = status || "BODY_EXTENSION_HOLD";
    canvas.dataset.activeBody = body;
    canvas.dataset.body = body;
    canvas.dataset.wrongBodyFallback = "blocked";

    return {
      ok: false,
      version: VERSION,
      role: "render-platform",
      status: status || "BODY_EXTENSION_HOLD",
      body,
      wrongBodyFallbackBlocked: true,
      ownsProjection: true,
      ownsDispatch: true,
      ownsBodyPixels: false,
      profileMerge: false,
      generatedImage: false,
      visualPassClaimed: false
    };
  }

  function platformDrawSphere(ctx, canvas, extension, options) {
    const body = normalizeBody(extension.id);
    const activeBody = normalizeBody(options.activeBody || options.body || body);

    if (body !== activeBody) {
      return writeCanvasHold(canvas, activeBody, "EXTENSION_BODY_MISMATCH_BLOCKED");
    }

    if (activeBody === "audrelia-moon" && body !== "audrelia-moon") {
      return writeCanvasHold(canvas, activeBody, "MOON_WRONG_EXTENSION_BLOCKED");
    }

    const profile = extension.createProfile();
    const texture = extension.buildTexture();

    if (!texture || !texture.data || !texture.width || !texture.height || typeof extension.sampleSurface !== "function") {
      return writeCanvasHold(canvas, activeBody, "EXTENSION_TEXTURE_CONTRACT_FAILED");
    }

    const workSize = Math.min(MAX_WORK_SIZE, Math.max(420, Math.min(canvas.width, canvas.height)));
    const work = makeCanvas(workSize, workSize);
    const workCtx = work.getContext("2d", { alpha: true, willReadFrequently: true });
    const image = workCtx.createImageData(workSize, workSize);
    const pixels = image.data;

    const radius = workSize * 0.455;
    const radius2 = radius * radius;
    const center = workSize / 2;
    const tilt = (Number(profile.axialTiltDeg) || 0) * DEG;
    const cosTilt = Math.cos(tilt);
    const sinTilt = Math.sin(tilt);
    const centerLon = wrap01(Number(options.longitude) || 0) * TAU;
    const color = [0, 0, 0];

    const lightX0 = -0.46;
    const lightY0 = -0.32;
    const lightZ0 = 0.83;
    const lightMagnitude = Math.sqrt(lightX0 * lightX0 + lightY0 * lightY0 + lightZ0 * lightZ0);
    const lx = lightX0 / lightMagnitude;
    const ly = lightY0 / lightMagnitude;
    const lz = lightZ0 / lightMagnitude;

    const halfX0 = lx;
    const halfY0 = ly;
    const halfZ0 = lz + 1;
    const halfMagnitude = Math.sqrt(halfX0 * halfX0 + halfY0 * halfY0 + halfZ0 * halfZ0);
    const hx = halfX0 / halfMagnitude;
    const hy = halfY0 / halfMagnitude;
    const hz = halfZ0 / halfMagnitude;

    let ptr = 0;

    for (let py = 0; py < workSize; py += 1) {
      const y = py + 0.5 - center;

      for (let px = 0; px < workSize; px += 1) {
        const x = px + 0.5 - center;
        const d2 = x * x + y * y;

        if (d2 > radius2) {
          pixels[ptr] = 0;
          pixels[ptr + 1] = 0;
          pixels[ptr + 2] = 0;
          pixels[ptr + 3] = 0;
          ptr += 4;
          continue;
        }

        const sx = x / radius;
        const sy = -y / radius;
        const sz = Math.sqrt(Math.max(0, 1 - sx * sx - sy * sy));

        const bx = sx * cosTilt + sy * sinTilt;
        const by = -sx * sinTilt + sy * cosTilt;
        const bz = sz;

        const lon = Math.atan2(bx, bz) - centerLon;
        const lat = Math.asin(clamp(by, -1, 1));
        const u = wrap01(lon / TAU + 0.5);
        const v = 0.5 - lat / PI;

        extension.sampleSurface(texture, u, v, color, {
          body,
          profile,
          normal: { x: sx, y: sy, z: sz },
          lon,
          lat
        });

        const nDotL = clamp(sx * lx + sy * ly + sz * lz, 0, 1);
        const nDotH = clamp(sx * hx + sy * hy + sz * hz, 0, 1);
        const dist = Math.sqrt(d2) / radius;
        const rim = smoothstep(0.68, 1, dist);

        let baseLight;
        if (profile.lightModel === "star") {
          baseLight = 0.82 + nDotL * 0.22;
        } else if (profile.lightModel === "moon") {
          baseLight = 0.24 + nDotL * 0.86;
        } else {
          baseLight = 0.31 + nDotL * 0.76;
        }

        let r = color[0] * baseLight;
        let g = color[1] * baseLight;
        let b = color[2] * baseLight;

        if (profile.lightModel === "star") {
          const glow = 18 + rim * 28;
          r += glow;
          g += glow * 0.72;
          b += glow * 0.24;
        } else if (profile.lightModel === "moon") {
          const spec = Math.pow(nDotH, 72) * 0.045;
          const rimShade = rim * 18;

          r += spec * 32 - rimShade * 0.08;
          g += spec * 34 - rimShade * 0.06;
          b += spec * 36 - rimShade * 0.03;

          const grayAverage = (r + g + b) / 3;
          r = grayAverage * 0.98 + r * 0.02;
          g = grayAverage * 0.99 + g * 0.01;
          b = grayAverage * 1.02 + b * 0.02;
        } else {
          const water = color[2] > color[1] + 8 && color[2] > color[0] + 14;
          const spec = water ? Math.pow(nDotH, 48) * 0.28 : Math.pow(nDotH, 80) * 0.04;
          const atmosphere = rim * 28;

          r += spec * 105 + atmosphere * 0.45;
          g += spec * 140 + atmosphere * 1.0;
          b += spec * 205 + atmosphere * 1.65;
        }

        const edgeAlpha = clamp((1 - dist) / 0.018, 0, 1);

        pixels[ptr] = clamp(Math.round(r), 0, 255);
        pixels[ptr + 1] = clamp(Math.round(g), 0, 255);
        pixels[ptr + 2] = clamp(Math.round(b), 0, 255);
        pixels[ptr + 3] = Math.round(edgeAlpha * 255);
        ptr += 4;
      }
    }

    workCtx.putImageData(image, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const zoom = clamp(Number(options.zoom) || 100, 70, 240) / 100;
    const drawSize = Math.min(canvas.width, canvas.height) * 0.92 * zoom;
    const dx = (canvas.width - drawSize) / 2;
    const dy = (canvas.height - drawSize) / 2;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const outerRadius = drawSize / 2;

    ctx.drawImage(work, dx, dy, drawSize, drawSize);

    if (profile.lightModel === "star") {
      ctx.save();
      const corona = ctx.createRadialGradient(cx, cy, outerRadius * 0.82, cx, cy, outerRadius * 1.24);
      corona.addColorStop(0, "rgba(255,226,110,0.18)");
      corona.addColorStop(0.58, "rgba(255,128,26,0.12)");
      corona.addColorStop(1, "rgba(255,128,26,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius * 1.24, 0, TAU);
      ctx.fillStyle = corona;
      ctx.fill();
      ctx.restore();
    }

    if (profile.lightModel === "moon") {
      ctx.save();
      const lunarHalo = ctx.createRadialGradient(cx, cy, outerRadius * 0.74, cx, cy, outerRadius * 1.12);
      lunarHalo.addColorStop(0, "rgba(210,216,218,0)");
      lunarHalo.addColorStop(0.72, "rgba(210,216,218,0.045)");
      lunarHalo.addColorStop(1, "rgba(210,216,218,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius * 1.12, 0, TAU);
      ctx.fillStyle = lunarHalo;
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, outerRadius * 1.008, 0, TAU);
    ctx.strokeStyle = profile.rimColor || "rgba(255,255,255,0.62)";
    ctx.lineWidth = Math.max(2, outerRadius * 0.010);
    ctx.shadowColor = profile.glowColor || "rgba(255,255,255,0.22)";
    ctx.shadowBlur = outerRadius * 0.08;
    ctx.stroke();
    ctx.restore();

    const extensionReceipt = typeof extension.getStatus === "function" ? extension.getStatus() : null;

    canvas.dataset.renderHold = "false";
    canvas.dataset.body = body;
    canvas.dataset.activeBody = activeBody;
    canvas.dataset.extensionId = extension.id;
    canvas.dataset.extensionLabel = extension.label || profile.label || activeBody;
    canvas.dataset.wrongBodyFallback = "blocked";

    return {
      ok: true,
      version: VERSION,
      role: "render-platform",
      platformReceipt: "SHOWROOM_GLOBE_RENDER_PLATFORM_RECEIPT",
      body,
      activeBody,
      label: profile.label,
      extensionVersion: extension.version,
      extensionReceipt,
      wrongBodyFallbackBlocked: true,
      ownsProjection: true,
      ownsDispatch: true,
      ownsBodyPixels: false,
      profileMerge: false,
      generatedImage: false,
      visualPassClaimed: false
    };
  }

  function createRenderer(canvas, initialOptions) {
    if (!canvas || canvas.nodeName !== "CANVAS") {
      throw new Error("ADRALIA_MOON_DISPATCH_AND_LUNAR_SURFACE_CORRECTION_TNT_v1 requires a canvas target.");
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    let currentOptions = Object.assign({}, initialOptions || {});
    let lastReceipt = null;
    let pendingBody = null;

    function render(nextOptions) {
      currentOptions = Object.assign({}, currentOptions, nextOptions || {});
      resizeCanvas(canvas);

      const body = resolveBody(currentOptions, canvas);
      const extension = findRegisteredExtension(body);

      canvas.dataset.body = body;
      canvas.dataset.activeBody = body;
      canvas.dataset.renderVersion = VERSION;
      canvas.dataset.renderPlatform = "showroom.globe.render.js";
      canvas.dataset.renderRole = "platform";
      canvas.dataset.ownsBodyPixels = "false";
      canvas.dataset.profileMerge = "false";
      canvas.dataset.generatedImage = "false";
      canvas.dataset.visualPassClaimed = "false";
      canvas.dataset.wrongBodyFallback = "blocked";

      if (!extension) {
        lastReceipt = writeCanvasHold(canvas, body, "EXTENSION_LOADING_OR_MISSING");

        if (pendingBody !== body) {
          pendingBody = body;

          loadExtension(body)
            .then(function onLoaded() {
              if (resolveBody(currentOptions, canvas) === body) {
                pendingBody = null;
                render(currentOptions);
              }
            })
            .catch(function onError(error) {
              pendingBody = null;
              lastReceipt = writeCanvasHold(
                canvas,
                body,
                "EXTENSION_LOAD_FAILED_" + String(error && error.message ? error.message : error)
              );
            });
        }

        return lastReceipt;
      }

      pendingBody = null;
      lastReceipt = platformDrawSphere(ctx, canvas, extension, Object.assign({}, currentOptions, { activeBody: body, body }));
      return lastReceipt;
    }

    function resize() {
      resizeCanvas(canvas);
      return render(currentOptions);
    }

    resizeCanvas(canvas);

    return {
      VERSION,
      version: VERSION,
      render,
      resize,
      getStatus() {
        const body = resolveBody(currentOptions, canvas);
        const extension = findRegisteredExtension(body);

        return {
          ok: true,
          version: VERSION,
          role: "render-platform",
          activeBody: body,
          extensionLoaded: Boolean(extension),
          extensionId: extension ? extension.id : null,
          registeredBodies: Object.keys(extensionRegistry),
          wrongBodyFallbackBlocked: true,
          ownsProjection: true,
          ownsDispatch: true,
          ownsBodyPixels: false,
          profileMerge: false,
          generatedImage: false,
          visualPassClaimed: false,
          lastReceipt
        };
      }
    };
  }

  function renderToCanvas(canvas, options) {
    const renderer = createRenderer(canvas, options || {});
    return renderer.render(options || {});
  }

  const api = {
    VERSION,
    version: VERSION,
    EXTENSION_FILES,
    registerExtension,
    loadExtension,
    resolveBody,
    createRenderer,
    renderToCanvas,
    getStatus() {
      return {
        ok: true,
        version: VERSION,
        role: "render-platform",
        registeredBodies: Object.keys(extensionRegistry),
        extensionFiles: EXTENSION_FILES,
        activeBodies: ["audrelia", "audrelia-sun", "audrelia-moon"],
        noWrongBodyFallback: true,
        moonFallbackToPlanet: false,
        ownsProjection: true,
        ownsDispatch: true,
        ownsBodyPixels: false,
        profileMerge: false,
        generatedImage: false,
        visualPassClaimed: false
      };
    }
  };

  global.DGBShowroomGlobeRender = api;

  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBShowroomGlobeRender = api;

  [
    global.DGBAudreliaPlanetRenderExtension,
    global.DGBAudreliaSunRenderExtension,
    global.DGBAdraliaMoonRenderExtension,
    global.DGBAudreliaClimateMoonRenderExtension
  ].forEach(function registerExisting(extension) {
    if (extension) registerExtension(extension);
  });

  try {
    global.dispatchEvent(new CustomEvent("dgb:showroom:audrelia-render-platform-ready", {
      detail: api.getStatus()
    }));
  } catch (_) {}
})(typeof window !== "undefined" ? window : globalThis);
