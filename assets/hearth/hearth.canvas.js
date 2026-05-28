// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_EVENT_DRIVEN_RENDER_GOVERNOR_TNT_v6
// Full-file replacement.
// Canvas authority only.
// Purpose:
// - Preserve cached atlas rendering from v5.
// - Stop continuous full-frame CPU raster.
// - Render only when dirty, dragging, resizing, moving, visible, or intentionally scheduled.
// - Add mobile-safe caps, frame-cost degradation, visibility pause, and governed idle rotation.
// - Preserve mount/getStatus compatibility, drag, yaw/tilt, inertia, canvas-only rendering.
// Does not own:
// - elevation generation
// - terrain classification
// - material authority
// - route orchestration
// - runtime ownership
// - controls ownership
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_EVENT_DRIVEN_RENDER_GOVERNOR_TNT_v6";
  const RECEIPT = "HEARTH_CANVAS_EVENT_DRIVEN_RENDER_GOVERNOR_RECEIPT_v6";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_CACHED_SURFACE_ATLAS_PERFORMANCE_RECOVERY_TNT_v5";
  const BASELINE_CONTRACT = "HEARTH_4K_NATURAL_ORGANIC_CANVAS_CONSUMER_TNT_v3";
  const VERSION = "2026-05-28.hearth-canvas-event-driven-render-governor-v6";

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

  function createEmptyAtlas(width, height) {
    const count = width * height;

    return {
      width,
      height,
      ready: false,
      complete: false,
      contract: CONTRACT,
      receipt: RECEIPT,
      pixels: new Uint8ClampedArray(count * 4),
      landDensity: new Uint8Array(count),
      shorelineGrounding: new Uint8Array(count),
      contactShadow: new Uint8Array(count),
      underlandOcclusion: new Uint8Array(count),
      shelfTransition: new Uint8Array(count),
      terrainRelief: new Uint8Array(count),
      ridgeRelief: new Uint8Array(count),
      basinShade: new Uint8Array(count),
      rimDarkening: new Uint8Array(count),
      rimCompression: new Uint8Array(count),
      atmosphereSeparation: new Uint8Array(count),
      surfaceAttachment: new Uint8Array(count),
      curvatureLock: new Uint8Array(count),
      waterDepthShade: new Uint8Array(count),
      bridgePotential: new Uint8Array(count),
      landMask: new Uint8Array(count)
    };
  }

  function detectMobile(mount) {
    const width = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0,
      mount ? mount.clientWidth || 0 : 0
    );

    const coarse =
      typeof matchMedia === "function" &&
      (
        matchMedia("(pointer: coarse)").matches ||
        matchMedia("(hover: none)").matches
      );

    return width <= 760 || coarse || (window.devicePixelRatio || 1) > 1.75;
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
    canvas.dataset.hearthCanvasBaselineContract = BASELINE_CONTRACT;
    canvas.dataset.hearthMaterialsConsumer = "true";
    canvas.dataset.hearthCanvasGovernorMode = "true";
    canvas.dataset.hearthCanvasEventDriven = "true";
    canvas.dataset.hearthCanvasContinuousRaster = "false";
    canvas.dataset.hearthCanvasAtlasMode = "true";
    canvas.dataset.hearthCachedAtlas = "true";
    canvas.dataset.hearthDirectPerFrameSampling = "false";
    canvas.dataset.hearthBilinearAtlasSampling = "true";
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

    if (!materialFn) {
      throw new Error("Hearth material sampler unavailable for governed atlas construction.");
    }

    let disposed = false;
    let dragging = false;
    let visible = !document.hidden;
    let mountVisible = true;
    let dirty = true;
    let renderPending = false;
    let idlePaused = false;
    let frameBudgetExceeded = false;
    let lastX = 0;
    let lastY = 0;
    let yaw = Number.isFinite(options.yaw) ? options.yaw : -0.28;
    let tilt = Number.isFinite(options.tilt) ? options.tilt : -0.18;
    let yawVelocity = Number.isFinite(options.yawVelocity) ? options.yawVelocity : 0.0018;
    let tiltVelocity = 0;
    let frames = 0;
    let renderCount = 0;
    let lastRenderAt = 0;
    let lastFrameCost = 0;
    let idleSince = performance.now();

    const mobileMode = Boolean(options.mobileMode ?? detectMobile(mount));
    let qualityTier = Number.isFinite(options.qualityTier)
      ? clamp(Math.round(options.qualityTier), 0, 3)
      : mobileMode
        ? 1
        : 2;

    const dragBudget = mobileMode ? 22 : 24;
    const settledBudget = mobileMode ? 32 : 36;

    const capTable = {
      0: {
        drag: mobileMode ? 340 : 420,
        settled: mobileMode ? 420 : 520,
        dpr: mobileMode ? 1.0 : 1.25,
        idleCadence: 360
      },
      1: {
        drag: mobileMode ? 390 : 500,
        settled: mobileMode ? 540 : 620,
        dpr: mobileMode ? 1.15 : 1.45,
        idleCadence: 280
      },
      2: {
        drag: mobileMode ? 420 : 540,
        settled: mobileMode ? 580 : 720,
        dpr: mobileMode ? 1.25 : 1.65,
        idleCadence: 180
      },
      3: {
        drag: mobileMode ? 460 : 580,
        settled: mobileMode ? 620 : 780,
        dpr: mobileMode ? 1.35 : 1.75,
        idleCadence: 120
      }
    };

    function currentCaps() {
      return capTable[qualityTier] || capTable[1];
    }

    const initialAtlasWidth = clamp(
      Math.round(options.initialAtlasWidth || (mobileMode ? 256 : 384)),
      128,
      mobileMode ? 384 : 512
    );

    const initialAtlasHeight = clamp(
      Math.round(options.initialAtlasHeight || (mobileMode ? 128 : 192)),
      64,
      mobileMode ? 192 : 256
    );

    const refinedAtlasAllowedByDefault = !mobileMode && options.refinedAtlasAllowed !== false;

    const refinedAtlasWidth = clamp(
      Math.round(options.refinedAtlasWidth || 768),
      initialAtlasWidth,
      1024
    );

    const refinedAtlasHeight = clamp(
      Math.round(options.refinedAtlasHeight || 384),
      initialAtlasHeight,
      512
    );

    let atlas = null;
    let atlasStatus = "building-initial-atlas";
    let atlasBuilds = 0;
    let refinedAtlasQueued = false;
    let refinedAtlasComplete = false;
    let refinedAtlasAllowed = refinedAtlasAllowedByDefault;
    let buffer = null;
    let bufferWidth = 0;
    let bufferHeight = 0;
    let resizeObserver = null;
    let intersectionObserver = null;
    let idleTimer = null;

    function publishStatus(value) {
      const caps = currentCaps();
      const renderCap = dragging ? caps.drag : caps.settled;

      document.documentElement.dataset.hearthCanvasAuthorityLoaded = "true";
      document.documentElement.dataset.hearthCanvasContract = CONTRACT;
      document.documentElement.dataset.hearthCanvasReceipt = RECEIPT;
      document.documentElement.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
      document.documentElement.dataset.hearthCanvasFrames = String(frames);
      document.documentElement.dataset.hearthCanvasRenderCount = String(renderCount);

      document.documentElement.dataset.hearthCanvasGovernorMode = "true";
      document.documentElement.dataset.hearthCanvasEventDriven = "true";
      document.documentElement.dataset.hearthCanvasContinuousRaster = "false";
      document.documentElement.dataset.hearthCanvasAtlasMode = "true";
      document.documentElement.dataset.hearthCanvasCachedAtlas = String(Boolean(atlas && atlas.ready));
      document.documentElement.dataset.hearthCanvasAtlasStatus = atlasStatus;
      document.documentElement.dataset.hearthCanvasAtlasWidth = String(atlas ? atlas.width : 0);
      document.documentElement.dataset.hearthCanvasAtlasHeight = String(atlas ? atlas.height : 0);
      document.documentElement.dataset.hearthCanvasAtlasBuilds = String(atlasBuilds);
      document.documentElement.dataset.hearthCanvasQualityTier = String(qualityTier);
      document.documentElement.dataset.hearthCanvasMobileMode = String(mobileMode);
      document.documentElement.dataset.hearthCanvasRenderCap = String(renderCap);
      document.documentElement.dataset.hearthCanvasLastFrameCost = lastFrameCost.toFixed(2);
      document.documentElement.dataset.hearthCanvasFrameBudgetExceeded = String(frameBudgetExceeded);
      document.documentElement.dataset.hearthCanvasIdlePaused = String(idlePaused);
      document.documentElement.dataset.hearthCanvasVisible = String(visible && mountVisible);
      document.documentElement.dataset.hearthCanvasRefinedAtlasAllowed = String(refinedAtlasAllowed);
      document.documentElement.dataset.hearthCanvasDirectPerFrameSampling = "false";
      document.documentElement.dataset.hearthTextureFallbackUsed = "false";

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
          baselineContract: BASELINE_CONTRACT,
          version: VERSION,
          frames,
          renderCount,
          mounted: true,
          canvasFound: true,
          controlsBound: true,
          governorMode: true,
          eventDriven: true,
          continuousRaster: false,
          atlasMode: true,
          cachedAtlas: Boolean(atlas && atlas.ready),
          atlasStatus,
          atlasWidth: atlas ? atlas.width : 0,
          atlasHeight: atlas ? atlas.height : 0,
          atlasBuilds,
          qualityTier,
          mobileMode,
          renderCap,
          lastFrameCost,
          frameBudgetExceeded,
          idlePaused,
          visible: visible && mountVisible,
          refinedAtlasAllowed,
          directPerFrameSampling: false,
          textureFallbackUsed: false,
          generatedImage: false,
          graphicBox: false,
          webGL: false,
          visualPassClaimed: false
        });
      }
    }

    function safeMaterial(input) {
      try {
        const material = materialFn.call(materials, input);
        if (material && typeof material === "object") return material;
      } catch (_error) {}

      try {
        const material = materialFn.call(materials, input.x, input.y, input.z);
        if (material && typeof material === "object") return material;
      } catch (_error) {}

      return {
        rgb: [4, 14, 29],
        alpha: 1,
        isLand: false,
        isWater: true,
        landDensity: 0,
        shorelineGrounding: 0,
        contactShadow: 0,
        underlandOcclusion: 0,
        shelfTransition: 0,
        terrainRelief: 0,
        ridgeRelief: 0,
        basinShade: 0,
        rimDarkening: 0,
        rimCompression: 0,
        atmosphereSeparation: 0,
        surfaceAttachment: 0.5,
        curvatureLock: 0.7,
        waterDepthShade: 0.45,
        bridgePotential: 0
      };
    }

    function writeMaterialToAtlas(target, x, y, material) {
      const pixelIndex = y * target.width + x;
      const index = pixelIndex * 4;
      const rgb = rgbFromMaterial(material, [4, 14, 29]);
      const alpha = clamp01(material && (material.alpha ?? material.surfaceAlpha ?? material.opacity ?? 1));
      const isLand = booleanField(material, "isLand", Boolean(material && material.land));

      target.pixels[index] = rgb[0];
      target.pixels[index + 1] = rgb[1];
      target.pixels[index + 2] = rgb[2];
      target.pixels[index + 3] = clamp(Math.round(alpha * 255), 0, 255);

      target.landMask[pixelIndex] = isLand ? 255 : 0;
      target.landDensity[pixelIndex] = clamp(Math.round(numericField(material, "landDensity", isLand ? 0.68 : 0) * 255), 0, 255);
      target.shorelineGrounding[pixelIndex] = clamp(Math.round(numericField(material, "shorelineGrounding", 0) * 255), 0, 255);
      target.contactShadow[pixelIndex] = clamp(Math.round(numericField(material, "contactShadow", 0) * 255), 0, 255);
      target.underlandOcclusion[pixelIndex] = clamp(Math.round(numericField(material, "underlandOcclusion", 0) * 255), 0, 255);
      target.shelfTransition[pixelIndex] = clamp(Math.round(numericField(material, "shelfTransition", 0) * 255), 0, 255);
      target.terrainRelief[pixelIndex] = clamp(Math.round(numericField(material, "terrainRelief", 0) * 255), 0, 255);
      target.ridgeRelief[pixelIndex] = clamp(Math.round(numericField(material, "ridgeRelief", 0) * 255), 0, 255);
      target.basinShade[pixelIndex] = clamp(Math.round(numericField(material, "basinShade", 0) * 255), 0, 255);
      target.rimDarkening[pixelIndex] = clamp(Math.round(numericField(material, "rimDarkening", 0) * 255), 0, 255);
      target.rimCompression[pixelIndex] = clamp(Math.round(numericField(material, "rimCompression", 0) * 255), 0, 255);
      target.atmosphereSeparation[pixelIndex] = clamp(Math.round(numericField(material, "atmosphereSeparation", isLand ? 0.6 : 0.1) * 255), 0, 255);
      target.surfaceAttachment[pixelIndex] = clamp(Math.round(numericField(material, "surfaceAttachment", isLand ? 0.75 : 0.5) * 255), 0, 255);
      target.curvatureLock[pixelIndex] = clamp(Math.round(numericField(material, "curvatureLock", 0.72) * 255), 0, 255);
      target.waterDepthShade[pixelIndex] = clamp(Math.round(numericField(material, "waterDepthShade", isLand ? 0 : 0.45) * 255), 0, 255);
      target.bridgePotential[pixelIndex] = clamp(Math.round(numericField(material, "bridgePotential", 0) * 255), 0, 255);
    }

    function sampleMaterialForAtlas(u, v) {
      const lon = u * 360 - 180;
      const lat = 90 - v * 180;
      const world = lonLatToVector(lon, lat);

      return safeMaterial({
        x: world.x,
        y: world.y,
        z: world.z,
        u,
        v,
        lon,
        lat,
        viewDot: 1,
        normalDot: 1,
        radiusPosition: 0,
        routeContract: options.routeContract || null,
        routeReceipt: options.routeReceipt || null,
        canvasContract: CONTRACT,
        elevation,
        composition,
        tectonics,
        hydrology
      });
    }

    function buildAtlasSync(width, height) {
      const target = createEmptyAtlas(width, height);

      for (let y = 0; y < height; y += 1) {
        const v = height <= 1 ? 0 : y / (height - 1);

        for (let x = 0; x < width; x += 1) {
          const u = width <= 1 ? 0 : x / (width - 1);
          writeMaterialToAtlas(target, x, y, sampleMaterialForAtlas(u, v));
        }
      }

      target.ready = true;
      target.complete = true;
      atlasBuilds += 1;
      return target;
    }

    function canRefineAtlas() {
      return Boolean(
        refinedAtlasAllowed &&
        !mobileMode &&
        !dragging &&
        visible &&
        mountVisible &&
        !frameBudgetExceeded &&
        qualityTier >= 2 &&
        performance.now() - idleSince > 1800
      );
    }

    function scheduleRefinedAtlas() {
      if (refinedAtlasQueued || refinedAtlasComplete || disposed) return;
      if (refinedAtlasWidth <= initialAtlasWidth && refinedAtlasHeight <= initialAtlasHeight) return;
      if (!canRefineAtlas()) return;

      refinedAtlasQueued = true;

      const build = () => {
        if (disposed || !canRefineAtlas()) {
          refinedAtlasQueued = false;
          return;
        }

        const target = createEmptyAtlas(refinedAtlasWidth, refinedAtlasHeight);
        let y = 0;
        const rowsPerChunk = 4;

        atlasStatus = "building-refined-atlas";
        publishStatus("atlas-refine-started");

        const step = () => {
          if (disposed) return;

          if (!canRefineAtlas()) {
            refinedAtlasQueued = false;
            atlasStatus = atlas && atlas.ready ? "initial-atlas-ready" : "refine-paused";
            publishStatus("atlas-refine-paused");
            return;
          }

          const yEnd = Math.min(target.height, y + rowsPerChunk);

          for (; y < yEnd; y += 1) {
            const v = target.height <= 1 ? 0 : y / (target.height - 1);

            for (let x = 0; x < target.width; x += 1) {
              const u = target.width <= 1 ? 0 : x / (target.width - 1);
              writeMaterialToAtlas(target, x, y, sampleMaterialForAtlas(u, v));
            }
          }

          if (y < target.height) {
            if (typeof requestIdleCallback === "function") {
              requestIdleCallback(step, { timeout: 180 });
            } else {
              setTimeout(step, 16);
            }
            return;
          }

          target.ready = true;
          target.complete = true;
          atlas = target;
          atlasBuilds += 1;
          refinedAtlasComplete = true;
          atlasStatus = "refined-atlas-ready";
          markDirty("atlas-refined");
          publishStatus("atlas-refined");
        };

        step();
      };

      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(build, { timeout: 1000 });
      } else {
        setTimeout(build, 1800);
      }
    }

    try {
      atlasStatus = "building-initial-atlas";
      atlas = buildAtlasSync(initialAtlasWidth, initialAtlasHeight);
      atlasStatus = "initial-atlas-ready";
    } catch (_error) {
      atlas = createEmptyAtlas(32, 16);

      for (let y = 0; y < atlas.height; y += 1) {
        for (let x = 0; x < atlas.width; x += 1) {
          writeMaterialToAtlas(atlas, x, y, {
            rgb: [4, 14, 29],
            alpha: 1,
            isLand: false,
            isWater: true,
            waterDepthShade: 0.55
          });
        }
      }

      atlas.ready = true;
      atlas.complete = true;
      atlasStatus = "safe-ocean-atlas-ready";
      atlasBuilds += 1;
    }

    function currentRenderCap() {
      const caps = currentCaps();
      return dragging ? caps.drag : caps.settled;
    }

    function resize() {
      const box = mount.getBoundingClientRect();
      const cssSize = Math.max(
        260,
        Math.floor(Math.min(box.width || 420, box.height || box.width || 420))
      );

      const caps = currentCaps();
      const dpr = caps.dpr;
      const maxSize = currentRenderCap();
      const size = Math.min(maxSize, Math.max(320, Math.floor(cssSize * dpr)));

      if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
        buffer = null;
        bufferWidth = 0;
        bufferHeight = 0;
        return true;
      }

      return false;
    }

    function readAtlasPixel(source, x, y) {
      const xx = ((x % source.width) + source.width) % source.width;
      const yy = clamp(y, 0, source.height - 1);
      const pixelIndex = yy * source.width + xx;
      const index = pixelIndex * 4;

      return {
        r: source.pixels[index],
        g: source.pixels[index + 1],
        b: source.pixels[index + 2],
        a: source.pixels[index + 3] / 255,
        isLand: source.landMask[pixelIndex] >= 128,
        landDensity: source.landDensity[pixelIndex] / 255,
        shorelineGrounding: source.shorelineGrounding[pixelIndex] / 255,
        contactShadow: source.contactShadow[pixelIndex] / 255,
        underlandOcclusion: source.underlandOcclusion[pixelIndex] / 255,
        shelfTransition: source.shelfTransition[pixelIndex] / 255,
        terrainRelief: source.terrainRelief[pixelIndex] / 255,
        ridgeRelief: source.ridgeRelief[pixelIndex] / 255,
        basinShade: source.basinShade[pixelIndex] / 255,
        rimDarkening: source.rimDarkening[pixelIndex] / 255,
        rimCompression: source.rimCompression[pixelIndex] / 255,
        atmosphereSeparation: source.atmosphereSeparation[pixelIndex] / 255,
        surfaceAttachment: source.surfaceAttachment[pixelIndex] / 255,
        curvatureLock: source.curvatureLock[pixelIndex] / 255,
        waterDepthShade: source.waterDepthShade[pixelIndex] / 255,
        bridgePotential: source.bridgePotential[pixelIndex] / 255
      };
    }

    function blendAtlasSample(a, b, t) {
      const k = clamp01(t);

      return {
        r: lerp(a.r, b.r, k),
        g: lerp(a.g, b.g, k),
        b: lerp(a.b, b.b, k),
        a: lerp(a.a, b.a, k),
        isLand: lerp(a.isLand ? 1 : 0, b.isLand ? 1 : 0, k) >= 0.5,
        landDensity: lerp(a.landDensity, b.landDensity, k),
        shorelineGrounding: lerp(a.shorelineGrounding, b.shorelineGrounding, k),
        contactShadow: lerp(a.contactShadow, b.contactShadow, k),
        underlandOcclusion: lerp(a.underlandOcclusion, b.underlandOcclusion, k),
        shelfTransition: lerp(a.shelfTransition, b.shelfTransition, k),
        terrainRelief: lerp(a.terrainRelief, b.terrainRelief, k),
        ridgeRelief: lerp(a.ridgeRelief, b.ridgeRelief, k),
        basinShade: lerp(a.basinShade, b.basinShade, k),
        rimDarkening: lerp(a.rimDarkening, b.rimDarkening, k),
        rimCompression: lerp(a.rimCompression, b.rimCompression, k),
        atmosphereSeparation: lerp(a.atmosphereSeparation, b.atmosphereSeparation, k),
        surfaceAttachment: lerp(a.surfaceAttachment, b.surfaceAttachment, k),
        curvatureLock: lerp(a.curvatureLock, b.curvatureLock, k),
        waterDepthShade: lerp(a.waterDepthShade, b.waterDepthShade, k),
        bridgePotential: lerp(a.bridgePotential, b.bridgePotential, k)
      };
    }

    function sampleAtlasBilinear(u, v) {
      const source = atlas;

      if (!source || !source.ready) {
        return {
          r: 4,
          g: 14,
          b: 29,
          a: 1,
          isLand: false,
          landDensity: 0,
          shorelineGrounding: 0,
          contactShadow: 0,
          underlandOcclusion: 0,
          shelfTransition: 0,
          terrainRelief: 0,
          ridgeRelief: 0,
          basinShade: 0,
          rimDarkening: 0,
          rimCompression: 0,
          atmosphereSeparation: 0,
          surfaceAttachment: 0.5,
          curvatureLock: 0.7,
          waterDepthShade: 0.45,
          bridgePotential: 0
        };
      }

      const fu = (((u % 1) + 1) % 1) * (source.width - 1);
      const fv = clamp(v, 0, 0.999999) * (source.height - 1);

      const x0 = Math.floor(fu);
      const y0 = Math.floor(fv);
      const x1 = (x0 + 1) % source.width;
      const y1 = clamp(y0 + 1, 0, source.height - 1);

      const tx = fu - x0;
      const ty = fv - y0;

      const c00 = readAtlasPixel(source, x0, y0);
      const c10 = readAtlasPixel(source, x1, y0);
      const c01 = readAtlasPixel(source, x0, y1);
      const c11 = readAtlasPixel(source, x1, y1);

      const top = blendAtlasSample(c00, c10, tx);
      const bottom = blendAtlasSample(c01, c11, tx);

      return blendAtlasSample(top, bottom, ty);
    }

    function applyAtlasShading(sample, sphere) {
      const z = sphere.z;
      const rr = sphere.rr;
      const sx = sphere.sx;
      const sy = sphere.sy;

      const isLand = Boolean(sample.isLand);
      const landDensity = clamp01(sample.landDensity);
      const shorelineGrounding = clamp01(sample.shorelineGrounding);
      const contactShadow = clamp01(sample.contactShadow);
      const underlandOcclusion = clamp01(sample.underlandOcclusion);
      const shelfTransition = clamp01(sample.shelfTransition);
      const terrainRelief = clamp01(sample.terrainRelief);
      const ridgeRelief = clamp01(sample.ridgeRelief);
      const basinShade = clamp01(sample.basinShade);
      const rimDarkening = clamp01(sample.rimDarkening);
      const rimCompression = clamp01(sample.rimCompression);
      const atmosphereSeparation = clamp01(sample.atmosphereSeparation);
      const surfaceAttachment = clamp01(sample.surfaceAttachment);
      const curvatureLock = clamp01(sample.curvatureLock);
      const waterDepthShade = clamp01(sample.waterDepthShade);
      const bridgePotential = clamp01(sample.bridgePotential);

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

      let c = [
        clamp(Math.round(sample.r), 0, 255),
        clamp(Math.round(sample.g), 0, 255),
        clamp(Math.round(sample.b), 0, 255)
      ];

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
          c = mix(c, [112, 105, 67], clamp01(bridgePotential * 0.08));
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

    function render(reason = "dirty") {
      if (disposed || !visible || !mountVisible) {
        renderPending = false;
        idlePaused = true;
        publishStatus("render-paused");
        return;
      }

      renderPending = false;
      dirty = false;
      idlePaused = false;

      const start = performance.now();
      const resized = resize();

      const width = canvas.width;
      const height = canvas.height;

      if (!buffer || bufferWidth !== width || bufferHeight !== height || resized) {
        buffer = ctx.createImageData(width, height);
        bufferWidth = width;
        bufferHeight = height;
      }

      const image = buffer;
      const data = image.data;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.445;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

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
          const u = lonRad / TAU + 0.5;
          const v = 0.5 - latRad / Math.PI;
          const sample = sampleAtlasBilinear(u, v);
          const c = applyAtlasShading(sample, { z, rr, sx, sy });

          data[index] = c[0];
          data[index + 1] = c[1];
          data[index + 2] = c[2];
          data[index + 3] = 255;
        }
      }

      ctx.putImageData(image, 0, 0);

      frames += 1;
      renderCount += 1;
      lastRenderAt = performance.now();
      lastFrameCost = lastRenderAt - start;

      const budget = dragging ? dragBudget : settledBudget;
      frameBudgetExceeded = lastFrameCost > budget;

      if (frameBudgetExceeded && qualityTier > 0) {
        qualityTier -= 1;
        refinedAtlasAllowed = false;
        buffer = null;
      }

      publishStatus(`rendered-${reason}`);

      const hasInertia =
        !dragging &&
        (
          Math.abs(yawVelocity) > 0.00045 ||
          Math.abs(tiltVelocity) > 0.00035
        );

      if (hasInertia) {
        yaw += yawVelocity;
        tilt += tiltVelocity;
        yawVelocity *= 0.955;
        tiltVelocity *= 0.90;

        if (tilt > 1.3) {
          tilt = 1.3;
          tiltVelocity *= -0.16;
        }

        if (tilt < -1.3) {
          tilt = -1.3;
          tiltVelocity *= -0.16;
        }

        markDirty("inertia");
        return;
      }

      if (!dragging) {
        idleSince = performance.now();
        scheduleIdleAutoTick();
        scheduleRefinedAtlas();
      }
    }

    function requestRender(reason = "dirty") {
      if (disposed || renderPending || !visible || !mountVisible) return;

      renderPending = true;
      requestAnimationFrame(() => render(reason));
    }

    function markDirty(reason = "dirty") {
      dirty = true;
      requestRender(reason);
    }

    function scheduleIdleAutoTick() {
      if (disposed || dragging || !visible || !mountVisible) return;

      if (idleTimer) clearTimeout(idleTimer);

      const cadence = currentCaps().idleCadence;

      idleTimer = setTimeout(() => {
        if (disposed || dragging || !visible || !mountVisible) return;

        const rotationStep = mobileMode ? 0.0024 : 0.0038;
        yaw += rotationStep;
        markDirty("governed-idle-rotation");
      }, cadence);
    }

    function pointerDown(event) {
      dragging = true;
      idlePaused = false;
      lastX = event.clientX;
      lastY = event.clientY;
      yawVelocity = 0;
      tiltVelocity = 0;

      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }

      canvas.setPointerCapture?.(event.pointerId);
      markDirty("drag-start");
      publishStatus("drag-start");
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

      yawVelocity = dx * 0.00072;
      tiltVelocity = dy * 0.00046;

      markDirty("drag-move");
      event.preventDefault();
    }

    function pointerUp(event) {
      dragging = false;
      canvas.releasePointerCapture?.(event.pointerId);
      markDirty("drag-end");
      publishStatus("drag-end");
      event.preventDefault();
    }

    function onVisibilityChange() {
      visible = !document.hidden;

      if (visible) {
        markDirty("visibility-return");
      } else {
        idlePaused = true;
        if (idleTimer) {
          clearTimeout(idleTimer);
          idleTimer = null;
        }
        publishStatus("visibility-hidden");
      }
    }

    function onResize() {
      buffer = null;
      markDirty("resize");
    }

    canvas.addEventListener("pointerdown", pointerDown, { passive: false });
    canvas.addEventListener("pointermove", pointerMove, { passive: false });
    canvas.addEventListener("pointerup", pointerUp, { passive: false });
    canvas.addEventListener("pointercancel", pointerUp, { passive: false });
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(mount);
    } else {
      window.addEventListener("resize", onResize, { passive: true });
    }

    if (typeof IntersectionObserver === "function") {
      intersectionObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        mountVisible = Boolean(entry && entry.isIntersecting);

        if (mountVisible) {
          markDirty("intersection-visible");
        } else {
          idlePaused = true;
          publishStatus("intersection-hidden");
        }
      }, { threshold: 0.05 });

      intersectionObserver.observe(mount);
    }

    const api = {
      canvas,
      node: canvas,
      mounted: true,
      canvasFound: true,
      controlsBound: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      governorMode: true,
      eventDriven: true,
      continuousRaster: false,
      atlasMode: true,
      directPerFrameSampling: false,
      dispose() {
        disposed = true;

        if (idleTimer) clearTimeout(idleTimer);

        canvas.removeEventListener("pointerdown", pointerDown);
        canvas.removeEventListener("pointermove", pointerMove);
        canvas.removeEventListener("pointerup", pointerUp);
        canvas.removeEventListener("pointercancel", pointerUp);
        document.removeEventListener("visibilitychange", onVisibilityChange);

        if (resizeObserver) resizeObserver.disconnect();
        else window.removeEventListener("resize", onResize);

        if (intersectionObserver) intersectionObserver.disconnect();

        canvas.remove();
      },
      getStatus() {
        return {
          contract: CONTRACT,
          receipt: RECEIPT,
          previousContract: PREVIOUS_CONTRACT,
          baselineContract: BASELINE_CONTRACT,
          version: VERSION,
          frames,
          renderCount,
          mounted: true,
          canvasFound: true,
          controlsBound: true,
          governorMode: true,
          eventDriven: true,
          continuousRaster: false,
          atlasMode: true,
          cachedAtlas: Boolean(atlas && atlas.ready),
          atlasStatus,
          atlasWidth: atlas ? atlas.width : 0,
          atlasHeight: atlas ? atlas.height : 0,
          atlasBuilds,
          qualityTier,
          mobileMode,
          renderCap: currentRenderCap(),
          lastFrameCost,
          frameBudgetExceeded,
          idlePaused,
          visible: visible && mountVisible,
          refinedAtlasAllowed,
          directPerFrameSampling: false,
          textureFallbackUsed: false,
          generatedImage: false,
          graphicBox: false,
          webGL: false,
          visualPassClaimed: false
        };
      }
    };

    root.__HEARTH_CANVAS_DISPOSE__ = api.dispose;

    publishStatus("mounted");
    markDirty("initial-mount");

    return api;
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      authority: "hearth-canvas-event-driven-render-governor",
      consumesMaterials: true,
      cachedAtlas: true,
      atlasMode: true,
      governorMode: true,
      eventDriven: true,
      continuousRaster: false,
      directPerFrameSampling: false,
      bilinearAtlasSampling: true,
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
    baselineContract: BASELINE_CONTRACT,
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
  document.documentElement.dataset.hearthCanvasGovernorMode = "true";
  document.documentElement.dataset.hearthCanvasEventDriven = "true";
  document.documentElement.dataset.hearthCanvasContinuousRaster = "false";
  document.documentElement.dataset.hearthCanvasAtlasMode = "true";
  document.documentElement.dataset.hearthCanvasCachedAtlas = "true";
  document.documentElement.dataset.hearthCanvasDirectPerFrameSampling = "false";
  document.documentElement.dataset.hearthBilinearAtlasSampling = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.webgl = "false";
  document.documentElement.dataset.visualPassClaimed = "false";

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
