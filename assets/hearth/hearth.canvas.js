// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_SPHERE_SURFACE_MATERIAL_CONSUMPTION_TNT_v4
// Full-file replacement.
// Canvas authority only.
// Purpose:
// - Preserve Hearth canvas mount compatibility.
// - Consume the live material authority directly per visible sphere point.
// - Keep texture-canvas sampling as fallback only.
// - Replace nearest-neighbor fallback with bilinear fallback sampling.
// - Use material fields for shoreline grounding, contact shadow, terrain relief,
//   rim compression, atmosphere separation, and surface attachment.
// Does not own:
// - elevation generation
// - terrain classification
// - material authority
// - route orchestration
// - runtime motion ownership
// - controls ownership
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_SPHERE_SURFACE_MATERIAL_CONSUMPTION_TNT_v4";
  const RECEIPT = "HEARTH_CANVAS_SPHERE_SURFACE_MATERIAL_CONSUMPTION_RECEIPT_v4";
  const PREVIOUS_CONTRACT = "HEARTH_4K_NATURAL_ORGANIC_CANVAS_CONSUMER_TNT_v3";
  const VERSION = "2026-05-28.hearth-canvas-sphere-surface-material-consumption-v4";

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const root = typeof window !== "undefined" ? window : globalThis;

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function mix(a, b, t) {
    const k = clamp01(t);
    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k))
    ];
  }

  function scaleColor(c, scalar) {
    return [
      clamp(Math.round(c[0] * scalar), 0, 255),
      clamp(Math.round(c[1] * scalar), 0, 255),
      clamp(Math.round(c[2] * scalar), 0, 255)
    ];
  }

  function addColor(c, amount) {
    const a = Number.isFinite(Number(amount)) ? Number(amount) : 0;
    return [
      clamp(Math.round(c[0] + a), 0, 255),
      clamp(Math.round(c[1] + a), 0, 255),
      clamp(Math.round(c[2] + a), 0, 255)
    ];
  }

  function normalize3(p) {
    const x = Number.isFinite(Number(p && p.x)) ? Number(p.x) : 0;
    const y = Number.isFinite(Number(p && p.y)) ? Number(p.y) : 0;
    const z = Number.isFinite(Number(p && p.z)) ? Number(p.z) : 1;
    const m = Math.hypot(x, y, z) || 1;

    return {
      x: x / m,
      y: y / m,
      z: z / m
    };
  }

  function lonLatToVector(lonDeg, latDeg) {
    const lon = Number(lonDeg || 0) * DEG;
    const lat = Number(latDeg || 0) * DEG;
    const c = Math.cos(lat);

    return normalize3({
      x: Math.sin(lon) * c,
      y: Math.sin(lat),
      z: Math.cos(lon) * c
    });
  }

  function rgbFromMaterial(material, fallback = [4, 14, 29]) {
    if (Array.isArray(material)) {
      return [
        clamp(Math.round(material[0]), 0, 255),
        clamp(Math.round(material[1]), 0, 255),
        clamp(Math.round(material[2]), 0, 255)
      ];
    }

    if (!material || typeof material !== "object") return fallback.slice();

    const source =
      Array.isArray(material.rgb)
        ? material.rgb
        : Array.isArray(material.color)
          ? material.color
          : Array.isArray(material.finalColorHint)
            ? material.finalColorHint
            : Array.isArray(material.baseColor)
              ? material.baseColor
              : Array.isArray(material.rgba)
                ? material.rgba
                : null;

    if (!source) return fallback.slice();

    return [
      clamp(Math.round(source[0]), 0, 255),
      clamp(Math.round(source[1]), 0, 255),
      clamp(Math.round(source[2]), 0, 255)
    ];
  }

  function numericField(material, key, fallback = 0) {
    if (!material || typeof material !== "object") return fallback;
    return clamp01(material[key]);
  }

  function booleanField(material, key, fallback = false) {
    if (!material || typeof material !== "object") return fallback;
    if (typeof material[key] === "boolean") return material[key];
    return fallback;
  }

  function resolveAuthority(options, key, globalNames) {
    if (options && options[key]) return options[key];

    for (const name of globalNames) {
      if (root[name]) return root[name];
    }

    if (root.HEARTH && root.HEARTH[key]) return root.HEARTH[key];

    return null;
  }

  function resolveMaterialFunction(materials) {
    if (!materials || typeof materials !== "object") return null;

    const candidates = [
      materials.sample,
      materials.read,
      materials.getMaterial,
      materials.materialAt,
      materials.getMaterialAt,
      materials.getSurfaceMaterial,
      materials.get,
      materials.resolve,
      materials.resolveMaterial
    ];

    return candidates.find((fn) => typeof fn === "function") || null;
  }

  function mount(mountNode, options = {}) {
    const mount =
      mountNode ||
      document.getElementById("hearthCanvasMount") ||
      document.querySelector("[data-hearth-canvas-mount]");

    if (!mount) {
      throw new Error("Hearth canvas mount not found.");
    }

    mount.querySelectorAll("canvas").forEach((node) => node.remove());
    mount.querySelectorAll("[data-hearth-route-fallback]").forEach((node) => node.remove());

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: true });

    if (!ctx) {
      throw new Error("Hearth canvas 2D context unavailable.");
    }

    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    canvas.dataset.hearthMaterialsConsumer = "true";
    canvas.dataset.hearthDirectMaterialSampling = "true";
    canvas.dataset.hearthTextureCanvasFallback = "true";
    canvas.dataset.hearthBilinearTextureFallback = "true";
    canvas.dataset.hearthSphereSurfaceConsumption = "true";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";
    canvas.style.webkitUserSelect = "none";

    mount.appendChild(canvas);

    mount.querySelectorAll("[data-hearth-mount-fallback]").forEach((fallback) => {
      fallback.hidden = true;
      fallback.style.display = "none";
    });

    const materials = resolveAuthority(options, "materials", [
      "HEARTH_MATERIALS",
      "HearthMaterials",
      "HEARTH_MATERIAL_AUTHORITY"
    ]);

    const elevation = resolveAuthority(options, "elevation", [
      "HEARTH_ELEVATION",
      "HearthElevation"
    ]);

    const composition = resolveAuthority(options, "composition", [
      "HEARTH_COMPOSITION",
      "HearthComposition"
    ]);

    const tectonics = resolveAuthority(options, "tectonics", [
      "HEARTH_TECTONICS",
      "HearthTectonics"
    ]);

    const hydrology = resolveAuthority(options, "hydrology", [
      "HEARTH_HYDROLOGY",
      "HearthHydrology"
    ]);

    const materialFn = resolveMaterialFunction(materials);

    let textureCanvas = null;
    let textureCtx = null;
    let texture = null;

    try {
      textureCanvas =
        materials && typeof materials.createTextureCanvas === "function"
          ? materials.createTextureCanvas({ width: 1536, height: 768 })
          : null;

      textureCtx =
        textureCanvas && typeof textureCanvas.getContext === "function"
          ? textureCanvas.getContext("2d", { willReadFrequently: true })
          : null;

      texture =
        textureCanvas && textureCtx
          ? textureCtx.getImageData(0, 0, textureCanvas.width, textureCanvas.height)
          : null;
    } catch (_error) {
      textureCanvas = null;
      textureCtx = null;
      texture = null;
    }

    if (!materialFn && !texture) {
      throw new Error("Hearth materials unavailable for direct or fallback canvas consumption.");
    }

    let disposed = false;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let yaw = Number.isFinite(options.yaw) ? options.yaw : -0.28;
    let tilt = Number.isFinite(options.tilt) ? options.tilt : -0.18;
    let yawVelocity = Number.isFinite(options.yawVelocity) ? options.yawVelocity : 0.0022;
    let tiltVelocity = 0;
    let frames = 0;
    let usedDirectMaterial = false;
    let usedTextureFallback = false;

    function status(value) {
      document.documentElement.dataset.hearthCanvasAuthorityLoaded = "true";
      document.documentElement.dataset.hearthCanvasContract = CONTRACT;
      document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
      document.documentElement.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
      document.documentElement.dataset.hearthCanvasFrames = String(frames);
      document.documentElement.dataset.hearthDirectMaterialSampling = String(Boolean(usedDirectMaterial));
      document.documentElement.dataset.hearthTextureFallbackUsed = String(Boolean(usedTextureFallback));
      document.documentElement.dataset.hearthSphereSurfaceConsumption = "true";
      document.documentElement.dataset.hearthVisibleGlobeMounted = "true";
      document.documentElement.dataset.generatedImage = "false";
      document.documentElement.dataset.graphicBox = "false";
      document.documentElement.dataset.webgl = "false";
      document.documentElement.dataset.visualPassClaimed = "false";

      if (typeof options.onStatus === "function") {
        options.onStatus(value, {
          contract: CONTRACT,
          receipt: RECEIPT,
          previousContract: PREVIOUS_CONTRACT,
          frames,
          mounted: true,
          canvasFound: true,
          controlsBound: true,
          materialsLoaded: Boolean(materials),
          directMaterialSampling: Boolean(usedDirectMaterial),
          textureFallbackUsed: Boolean(usedTextureFallback),
          sphereSurfaceConsumption: true,
          generatedImage: false,
          graphicBox: false,
          webGL: false,
          visualPassClaimed: false
        });
      }
    }

    function resize() {
      const box = mount.getBoundingClientRect();
      const cssSize = Math.max(
        280,
        Math.floor(Math.min(box.width || 420, box.height || box.width || 420))
      );

      const dpr = Math.min(2.0, window.devicePixelRatio || 1);
      const maxSize = dragging ? 620 : 760;
      const size = Math.min(maxSize, Math.max(420, Math.floor(cssSize * dpr)));

      if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
      }
    }

    function sampleTextureBilinear(u, v) {
      if (!texture || !texture.width || !texture.height) {
        usedTextureFallback = false;
        return null;
      }

      usedTextureFallback = true;

      const w = texture.width;
      const h = texture.height;

      const fu = (((u % 1) + 1) % 1) * (w - 1);
      const fv = clamp(v, 0, 0.999999) * (h - 1);

      const x0 = Math.floor(fu);
      const y0 = Math.floor(fv);
      const x1 = (x0 + 1) % w;
      const y1 = clamp(y0 + 1, 0, h - 1);

      const tx = fu - x0;
      const ty = fv - y0;

      const read = (x, y) => {
        const index = (y * w + x) * 4;
        return [
          texture.data[index],
          texture.data[index + 1],
          texture.data[index + 2],
          texture.data[index + 3] / 255
        ];
      };

      const c00 = read(x0, y0);
      const c10 = read(x1, y0);
      const c01 = read(x0, y1);
      const c11 = read(x1, y1);

      const top = [
        lerp(c00[0], c10[0], tx),
        lerp(c00[1], c10[1], tx),
        lerp(c00[2], c10[2], tx),
        lerp(c00[3], c10[3], tx)
      ];

      const bottom = [
        lerp(c01[0], c11[0], tx),
        lerp(c01[1], c11[1], tx),
        lerp(c01[2], c11[2], tx),
        lerp(c01[3], c11[3], tx)
      ];

      return {
        rgb: [
          clamp(Math.round(lerp(top[0], bottom[0], ty)), 0, 255),
          clamp(Math.round(lerp(top[1], bottom[1], ty)), 0, 255),
          clamp(Math.round(lerp(top[2], bottom[2], ty)), 0, 255)
        ],
        alpha: clamp01(lerp(top[3], bottom[3], ty)),
        terrainClass: "texture_fallback",
        materialClass: "texture_fallback",
        isLand: false,
        isWater: true,
        landDensity: 0,
        shorelineGrounding: 0,
        contactShadow: 0,
        underlandOcclusion: 0,
        shelfTransition: 0,
        terrainRelief: 0,
        rimDarkening: 0,
        rimCompression: 0,
        atmosphereSeparation: 0,
        surfaceAttachment: 0.5,
        curvatureLock: 0.7
      };
    }

    function sampleMaterial(input) {
      if (materialFn) {
        try {
          const material = materialFn.call(materials, input);
          if (material && typeof material === "object") {
            usedDirectMaterial = true;
            return material;
          }
        } catch (_error) {
          // Fall through to texture fallback.
        }

        try {
          const material = materialFn.call(materials, input.x, input.y, input.z);
          if (material && typeof material === "object") {
            usedDirectMaterial = true;
            return material;
          }
        } catch (_error) {
          // Fall through to texture fallback.
        }
      }

      const fallback = sampleTextureBilinear(input.u, input.v);

      if (fallback) return fallback;

      return {
        rgb: [4, 14, 29],
        alpha: 1,
        terrainClass: "safe_ocean_fallback",
        materialClass: "safe_ocean_fallback",
        isLand: false,
        isWater: true,
        landDensity: 0,
        shorelineGrounding: 0,
        contactShadow: 0,
        underlandOcclusion: 0,
        shelfTransition: 0,
        terrainRelief: 0,
        rimDarkening: 0,
        rimCompression: 0,
        atmosphereSeparation: 0,
        surfaceAttachment: 0.5,
        curvatureLock: 0.7
      };
    }

    function applyMaterialShading(rgb, material, sphere) {
      const z = sphere.z;
      const rr = sphere.rr;
      const sx = sphere.sx;
      const sy = sphere.sy;

      const isLand = booleanField(material, "isLand", Boolean(material && material.land));
      const isWater = booleanField(material, "isWater", !isLand);

      const landDensity = numericField(material, "landDensity", isLand ? 0.68 : 0);
      const shorelineGrounding = numericField(material, "shorelineGrounding", 0);
      const contactShadow = numericField(material, "contactShadow", 0);
      const underlandOcclusion = numericField(material, "underlandOcclusion", 0);
      const shelfTransition = numericField(material, "shelfTransition", 0);
      const terrainRelief = numericField(material, "terrainRelief", 0);
      const ridgeRelief = numericField(material, "ridgeRelief", 0);
      const basinShade = numericField(material, "basinShade", 0);
      const rimDarkening = numericField(material, "rimDarkening", 0);
      const rimCompression = numericField(material, "rimCompression", 0);
      const atmosphereSeparation = numericField(material, "atmosphereSeparation", isLand ? 0.6 : 0.1);
      const surfaceAttachment = numericField(material, "surfaceAttachment", isLand ? 0.75 : 0.5);
      const curvatureLock = numericField(material, "curvatureLock", 0.72);
      const waterDepthShade = numericField(material, "waterDepthShade", isWater ? 0.45 : 0);
      const bridgePotential = numericField(material, "bridgePotential", 0);

      const lightVector = clamp(
        0.46 +
          z * 0.62 -
          sx * 0.085 -
          sy * 0.07 +
          terrainRelief * 0.045 +
          ridgeRelief * 0.035,
        0.15,
        1.16
      );

      const atmosphere = smoothstep(0.70, 1.0, rr);
      const limb = clamp(0.30 + z * 0.84, 0.14, 1.04);
      const glow = smoothstep(0.84, 1.0, rr);
      const sidePressure = clamp01(1 - z);

      let c = rgb.slice();

      if (isLand) {
        const reliefLift = terrainRelief * 8 + ridgeRelief * 5;
        const shadowWeight =
          contactShadow * 0.18 +
          underlandOcclusion * 0.14 +
          shorelineGrounding * 0.08 +
          rimCompression * sidePressure * 0.16 +
          rimDarkening * 0.16;

        c = addColor(c, reliefLift);
        c = mix(c, [3, 8, 14], clamp01(shadowWeight));
        c = mix(c, [82, 82, 62], clamp01(shorelineGrounding * 0.12));
        c = mix(c, [5, 13, 24], clamp01(sidePressure * rimCompression * 0.14));

        if (bridgePotential > 0.28) {
          c = mix(c, [112, 105, 67], clamp01(bridgePotential * 0.10));
        }

        const solidity = clamp(0.92 + landDensity * 0.10 + surfaceAttachment * 0.06, 0.86, 1.12);
        c = scaleColor(c, lightVector * limb * solidity);
      } else {
        const waterDarken = clamp01(waterDepthShade * 0.22 + basinShade * 0.12);
        c = mix(c, [3, 10, 22], waterDarken);
        c = mix(c, [18, 58, 76], shelfTransition * 0.10);
        c = scaleColor(c, lightVector * limb);
      }

      const atmosphereWeight = isLand
        ? atmosphere * clamp(0.22 - atmosphereSeparation * 0.12, 0.06, 0.20)
        : atmosphere * 0.38;

      c = mix(c, [5, 16, 31], atmosphereWeight);
      c = mix(c, [22, 78, 104], glow * (isLand ? 0.045 : 0.085));

      const curvatureAttachment = clamp01(surfaceAttachment * curvatureLock);
      if (isLand && sidePressure > 0.42) {
        c = mix(c, [4, 10, 18], sidePressure * (1 - curvatureAttachment) * 0.22);
      }

      return [
        clamp(c[0], 0, 255),
        clamp(c[1], 0, 255),
        clamp(c[2], 0, 255)
      ];
    }

    function render() {
      if (disposed) return;

      resize();

      const width = canvas.width;
      const height = canvas.height;
      const image = ctx.createImageData(width, height);
      const data = image.data;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.445;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      usedDirectMaterial = false;
      usedTextureFallback = false;

      for (let y = 0; y < height; y += 1) {
        const sy = (y - cy) / radius;

        for (let x = 0; x < width; x += 1) {
          const sx = (x - cx) / radius;
          const rr = sx * sx + sy * sy;
          const index = (y * width + x) * 4;

          if (rr > 1) {
            data[index] = 0;
            data[index + 1] = 0;
            data[index + 2] = 0;
            data[index + 3] = 0;
            continue;
          }

          const z = Math.sqrt(1 - rr);

          const yy = sy * cosT + z * sinT;
          const zz = z * cosT - sy * sinT;

          const lonRad = Math.atan2(sx, zz) + yaw;
          const latRad = Math.asin(clamp(yy, -1, 1));

          const lon = lonRad / DEG;
          const lat = latRad / DEG;
          const u = lonRad / TAU + 0.5;
          const v = 0.5 - latRad / Math.PI;

          const world = lonLatToVector(lon, lat);

          const sampleInput = {
            x: world.x,
            y: world.y,
            z: world.z,
            u,
            v,
            lon,
            lat,
            viewDot: z,
            normalDot: z,
            radiusPosition: rr,
            screenX: sx,
            screenY: sy,
            routeContract: options.routeContract || null,
            routeReceipt: options.routeReceipt || null,
            canvasContract: CONTRACT,
            elevation,
            composition,
            tectonics,
            hydrology
          };

          const material = sampleMaterial(sampleInput);
          const rgb = rgbFromMaterial(material, [4, 14, 29]);
          const c = applyMaterialShading(rgb, material, { z, rr, sx, sy });

          data[index] = c[0];
          data[index + 1] = c[1];
          data[index + 2] = c[2];
          data[index + 3] = 255;
        }
      }

      ctx.putImageData(image, 0, 0);

      if (!dragging) {
        yaw += yawVelocity;
        tilt += tiltVelocity;
        yawVelocity *= 0.992;
        tiltVelocity *= 0.93;

        if (Math.abs(yawVelocity) < 0.00125) yawVelocity = 0.00125;

        if (tilt > 1.3) {
          tilt = 1.3;
          tiltVelocity *= -0.18;
        }

        if (tilt < -1.3) {
          tilt = -1.3;
          tiltVelocity *= -0.18;
        }
      }

      frames += 1;

      if (frames < 4 || frames % 90 === 0) {
        status("rendering");
      }

      requestAnimationFrame(render);
    }

    function pointerDown(event) {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      yawVelocity = 0;
      tiltVelocity = 0;
      canvas.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    }

    function pointerMove(event) {
      if (!dragging) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;

      yaw += dx * 0.009;
      tilt += dy * 0.0075;
      tilt = clamp(tilt, -1.36, 1.36);

      yawVelocity = dx * 0.00085;
      tiltVelocity = dy * 0.00055;

      event.preventDefault();
    }

    function pointerUp(event) {
      dragging = false;
      canvas.releasePointerCapture?.(event.pointerId);
      event.preventDefault();
    }

    canvas.addEventListener("pointerdown", pointerDown, { passive: false });
    canvas.addEventListener("pointermove", pointerMove, { passive: false });
    canvas.addEventListener("pointerup", pointerUp, { passive: false });
    canvas.addEventListener("pointercancel", pointerUp, { passive: false });

    const api = {
      canvas,
      node: canvas,
      mounted: true,
      canvasFound: true,
      controlsBound: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      directMaterialSampling: true,
      textureFallbackAvailable: Boolean(texture),
      dispose() {
        disposed = true;
        canvas.removeEventListener("pointerdown", pointerDown);
        canvas.removeEventListener("pointermove", pointerMove);
        canvas.removeEventListener("pointerup", pointerUp);
        canvas.removeEventListener("pointercancel", pointerUp);
        canvas.remove();
      },
      getStatus() {
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          previousContract: PREVIOUS_CONTRACT,
          version: VERSION,
          frames,
          mounted: true,
          canvasFound: true,
          controlsBound: true,
          directMaterialSampling: true,
          textureFallbackAvailable: Boolean(texture),
          textureFallbackUsed: Boolean(usedTextureFallback),
          sphereSurfaceConsumption: true,
          generatedImage: false,
          graphicBox: false,
          webGL: false,
          visualPassClaimed: false
        };
      }
    };

    root.__HEARTH_CANVAS_DISPOSE__ = api.dispose;

    status("mounted");
    requestAnimationFrame(render);

    return api;
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-sphere-surface-material-consumption",
      consumesMaterials: true,
      directMaterialSampling: true,
      textureFallbackOnly: false,
      bilinearTextureFallback: true,
      visibleGlobeFirst: true,
      dragEnabled: true,
      poleSwivel: true,
      canvasOnly: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    });
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    mount,
    getStatus
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvas = api;
  root.HEARTH_CANVAS = Object.freeze(api);
  root.HearthCanvas = root.HEARTH_CANVAS;
  root.HEARTH_CANVAS_RECEIPT = getStatus();

  document.documentElement.dataset.hearthCanvasAuthorityLoaded = "true";
  document.documentElement.dataset.hearthCanvasContract = CONTRACT;
  document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
  document.documentElement.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
  document.documentElement.dataset.hearthCanvasConsumesMaterials = "true";
  document.documentElement.dataset.hearthDirectMaterialSampling = "true";
  document.documentElement.dataset.hearthSphereSurfaceConsumption = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.webgl = "false";
  document.documentElement.dataset.visualPassClaimed = "false";

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
