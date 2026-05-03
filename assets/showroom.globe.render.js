/* /assets/showroom.globe.render.js
   AUDRELIA_RENDER_EXTENSION_ARCHITECTURE_TNT_v1

   ROLE=
   SHARED_RENDER_PLATFORM

   OWNS=
   CANVAS_PIPELINE
   ORTHOGRAPHIC_PROJECTION
   LIGHTING_CONTEXT
   EXTENSION_REGISTRY
   ACTIVE_BODY_DISPATCH
   RECEIPT_AGGREGATION

   DOES_NOT_OWN=
   AUDRELIA_SURFACE_IDENTITY
   AUDRELIA_SUN_PLASMA_IDENTITY
   AUDRELIA_CLIMATE_MOON_SURFACE_IDENTITY
   ROUTE_COPY
   BUTTONS
   LABELS
   INSTRUMENT_STATE
   GAUGES

   BODY_EXTENSIONS=
   /assets/audrelia.planet.render.js
   /assets/audrelia.sun.render.js
   /assets/audrelia.climate-moon.render.js
*/

(function bindAudreliaRenderExtensionPlatform(global) {
  "use strict";

  const VERSION = "AUDRELIA_RENDER_EXTENSION_ARCHITECTURE_TNT_v1";
  const TAU = Math.PI * 2;
  const PI = Math.PI;
  const DEG = Math.PI / 180;
  const MAX_WORK_SIZE = 1024;

  const extensionRegistry = Object.create(null);
  const aliasRegistry = Object.create(null);
  const loadingRegistry = Object.create(null);

  const EXTENSION_FILES = Object.freeze({
    audrelia: "/assets/audrelia.planet.render.js?v=AUDRELIA_RENDER_EXTENSION_ARCHITECTURE_TNT_v1",
    "audrelia-sun": "/assets/audrelia.sun.render.js?v=AUDRELIA_RENDER_EXTENSION_ARCHITECTURE_TNT_v1",
    "audrelia-moon": "/assets/audrelia.climate-moon.render.js?v=AUDRELIA_RENDER_EXTENSION_ARCHITECTURE_TNT_v1"
  });

  const GLOBAL_EXTENSION_NAMES = Object.freeze({
    audrelia: "DGBAudreliaPlanetRenderExtension",
    "audrelia-sun": "DGBAudreliaSunRenderExtension",
    "audrelia-moon": "DGBAudreliaClimateMoonRenderExtension"
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function wrap01(value) {
    value = value % 1;
    return value < 0 ? value + 1 : value;
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function makeCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function normalizeBody(value) {
    value = String(value || "").trim().toLowerCase();

    if (value === "audrelia" || value === "audrelia-planet") return "audrelia";
    if (value === "audrelia-sun" || (value.includes("audrelia") && value.includes("sun"))) return "audrelia-sun";
    if (
      value === "audrelia-moon" ||
      value === "audrelia-climate-moon" ||
      value === "climate-moon" ||
      value === "manufactured-moon" ||
      value === "moon" ||
      value === "adralia-moon"
    ) {
      return "audrelia-moon";
    }

    if (value === "earth" || value.includes("planet")) return "audrelia";
    if (value === "sun" || value === "solar-system-sun" || value === "solar-sun" || value.includes("solar")) return "audrelia-sun";

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
      file: EXTENSION_FILES[id] || null,
      profileMerge: false,
      generatedImage: false,
      visualPassClaimed: false
    };
  }

  function findRegisteredExtension(body) {
    const normalized = normalizeBody(body);
    const aliasTarget = aliasRegistry[normalized] || normalized;
    return extensionRegistry[aliasTarget] || null;
  }

  function getGlobalExtension(body) {
    const normalized = normalizeBody(body);
    const globalName = GLOBAL_EXTENSION_NAMES[normalized];
    const extension = globalName ? global[globalName] : null;

    if (extension) {
      registerExtension(extension);
      return extension;
    }

    return null;
  }

  function loadExtension(body) {
    const normalized = normalizeBody(body);
    const existing = findRegisteredExtension(normalized) || getGlobalExtension(normalized);

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
        const loaded = findRegisteredExtension(normalized) || getGlobalExtension(normalized);

        if (loaded) {
          resolve(loaded);
        } else {
          reject(new Error("EXTENSION_LOADED_BUT_NOT_REGISTERED_" + normalized));
        }
      };

      script.onerror = function onError() {
        reject(new Error("EXTENSION_LOAD_FAILED_" + normalized));
      };

      global.document.head.appendChild(script);
    });

    return loadingRegistry[normalized];
  }

  function resolveBody(options, canvas) {
    options = options || {};

    const candidates = [
      options.body,
      options.activeBody,
      options.selectedBody,
      options.currentBody,
      options.model,
      options.type,
      canvas && canvas.dataset && canvas.dataset.body,
      canvas && canvas.dataset && canvas.dataset.activeBody,
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
    const cssSize = clamp(Math.round(rect.width || canvas.clientWidth || 420), 260, 1500);
    const dpr = clamp(global.devicePixelRatio || 1, 1, 3);
    const pixelSize = Math.round(cssSize * dpr);

    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

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

  function platformDrawSphere(ctx, canvas, extension, options) {
    const body = normalizeBody(extension.id);
    const profile = extension.createProfile();
    const texture = extension.buildTexture();
    const workSize = Math.min(MAX_WORK_SIZE, Math.max(360, Math.min(canvas.width, canvas.height)));
    const work = makeCanvas(workSize, workSize);
    const workCtx = work.getContext("2d", { alpha: true, willReadFrequently: true });
    const image = workCtx.createImageData(workSize, workSize);
    const pixels = image.data;

    const radius = workSize * 0.46;
    const radius2 = radius * radius;
    const center = workSize / 2;
    const tilt = (Number(profile.axialTiltDeg) || 0) * DEG;
    const cosTilt = Math.cos(tilt);
    const sinTilt = Math.sin(tilt);
    const centerLon = (Number(options.longitude) || 0) * TAU;
    const color = [0, 0, 0];

    const lightX0 = -0.44;
    const lightY0 = -0.30;
    const lightZ0 = 0.84;
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
        if (profile.lightModel === "star") baseLight = 0.82 + nDotL * 0.18;
        else baseLight = 0.32 + nDotL * 0.75;

        let r = color[0] * baseLight;
        let g = color[1] * baseLight;
        let b = color[2] * baseLight;

        if (profile.lightModel === "planet") {
          const water = color[2] > color[1] + 8 && color[2] > color[0] + 14;
          const spec = water ? Math.pow(nDotH, 48) * 0.32 : Math.pow(nDotH, 80) * 0.04;
          const atmosphere = rim * 30;

          r += spec * 105 + atmosphere * 0.45;
          g += spec * 140 + atmosphere * 1.0;
          b += spec * 205 + atmosphere * 1.65;
        } else if (profile.lightModel === "star") {
          const glow = body === "audrelia-sun" ? 16 + rim * 24 : 22 + rim * 32;
          r += glow;
          g += glow * 0.72;
          b += glow * 0.24;
        } else {
          const spec = Math.pow(nDotH, 70) * 0.08;
          const climateGlow = rim * 9;

          r += climateGlow + spec * 32;
          g += climateGlow * 1.02 + spec * 34;
          b += climateGlow * 1.05 + spec * 36;
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
      const halo = ctx.createRadialGradient(cx, cy, outerRadius * 0.72, cx, cy, outerRadius * 1.18);
      halo.addColorStop(0, "rgba(160,190,190,0)");
      halo.addColorStop(0.65, "rgba(160,210,195,0.055)");
      halo.addColorStop(1, "rgba(160,210,195,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius * 1.18, 0, TAU);
      ctx.fillStyle = halo;
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, outerRadius * 1.008, 0, TAU);
    ctx.strokeStyle = profile.rimColor || "rgba(255,255,255,0.62)";
    ctx.lineWidth = Math.max(2, outerRadius * 0.012);
    ctx.shadowColor = profile.glowColor || "rgba(255,255,255,0.22)";
    ctx.shadowBlur = outerRadius * 0.09;
    ctx.stroke();
    ctx.restore();

    const extensionReceipt = extension.getStatus();

    return {
      ok: true,
      version: VERSION,
      role: "render-platform",
      platformReceipt: "SHOWROOM_GLOBE_RENDER_PLATFORM_RECEIPT",
      body,
      label: profile.label,
      extensionVersion: extension.version,
      extensionReceipt,
      ownsProjection: true,
      ownsDispatch: true,
      ownsBodyPixels: false,
      profileMerge: false,
      generatedImage: false,
      visualPassClaimed: false
    };
  }

  function createRenderer(canvas, initialOptions) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("AUDRELIA_RENDER_EXTENSION_ARCHITECTURE_TNT_v1 requires a canvas target.");
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    let currentOptions = Object.assign({}, initialOptions || {});
    let lastReceipt = null;
    let pendingBody = null;

    function render(nextOptions) {
      currentOptions = Object.assign({}, currentOptions, nextOptions || {});
      resizeCanvas(canvas);

      const body = resolveBody(currentOptions, canvas);
      const extension = findRegisteredExtension(body) || getGlobalExtension(body);

      canvas.dataset.body = body;
      canvas.dataset.activeBody = body;
      canvas.dataset.renderVersion = VERSION;
      canvas.dataset.renderPlatform = "showroom.globe.render.js";
      canvas.dataset.renderRole = "platform";
      canvas.dataset.ownsBodyPixels = "false";
      canvas.dataset.profileMerge = "false";
      canvas.dataset.generatedImage = "false";
      canvas.dataset.visualPassClaimed = "false";

      if (!extension) {
        clearCanvas(canvas);

        if (pendingBody !== body) {
          pendingBody = body;
          loadExtension(body)
            .then(function onLoaded() {
              if (resolveBody(currentOptions, canvas) === body) {
                render(currentOptions);
              }
            })
            .catch(function onError(error) {
              lastReceipt = {
                ok: false,
                version: VERSION,
                role: "render-platform",
                status: "EXTENSION_LOAD_FAILED",
                body,
                error: String(error && error.message ? error.message : error),
                ownsBodyPixels: false,
                profileMerge: false,
                generatedImage: false,
                visualPassClaimed: false
              };
            });
        }

        lastReceipt = {
          ok: false,
          version: VERSION,
          role: "render-platform",
          status: "EXTENSION_LOADING",
          body,
          ownsProjection: true,
          ownsDispatch: true,
          ownsBodyPixels: false,
          profileMerge: false,
          generatedImage: false,
          visualPassClaimed: false
        };

        return lastReceipt;
      }

      pendingBody = null;
      lastReceipt = platformDrawSphere(ctx, canvas, extension, currentOptions);
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
          registeredBodies: Object.keys(extensionRegistry),
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
        legacyAliases: {
          earth: "audrelia",
          sun: "audrelia-sun",
          moon: "audrelia-moon",
          "solar-system-sun": "audrelia-sun"
        },
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
