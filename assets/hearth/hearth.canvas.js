// /assets/hearth/hearth.canvas.js
// HEARTH_G3_BOUNDARY_ALIGNMENT_CANVAS_RENDERER_TNT_v1
// Full-file replacement.
// Family: HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1
// Purpose:
// - Render one Hearth planet under the standardized five-file G3 boundary contract.
// - Use terrain authority for landmass-family boundaries.
// - Use hydration authority only as passive water/coast support.
// - No old globe/shell contract. No round-blob standard. No duplicate draw path.
// - No mountains. No terrain detail. No rivers. No weather. No climate. No clouds. No humidity.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_BOUNDARY_ALIGNMENT_CANVAS_RENDERER_TNT_v1";
  const FAMILY_CONTRACT = "HEARTH_G3_BOUNDARY_ALIGNMENT_ALL_FIVE_FILES_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-boundary-alignment-canvas-renderer";
  const RECEIPT = "HEARTH_G3_BOUNDARY_ALIGNMENT_CANVAS_RECEIPT";

  const MIN_SIZE = 300;
  const MAX_SIZE = 520;
  const TAU = Math.PI * 2;

  const TIC_TAC_TOE_DYNAMIC_PROTOCOL = Object.freeze({
    T1: "Retire old canvas, shell, round-blob, and globe-display paths.",
    T2: "Mount one active Hearth planet body.",
    T3: "Sample terrain boundary authority.",
    T4: "Sample hydration only as passive water/coast support.",
    T5: "Render four General Regions.",
    T6: "Render sixteen Countries.",
    T7: "Render nine Summit bands per General Region.",
    T8: "Fade zoning near the limb to prevent side-panel artifacts.",
    T9: "Return one G3 boundary-aligned planet receipt."
  });

  const SYSTEMIC_QUAD_A_ATTACK = Object.freeze({
    authority: "/assets/hearth/hearth.canvas.js",
    axis: "Single G3 planet renderer",
    artifact: "One Hearth planet with boundary-aligned landmass-family zoning",
    attack: "Reject old globe display, old shell, round blobs, duplicate draw path, hydration-first drift, terrain-detail drift, and G4 drift."
  });

  [
    "__HEARTH_CANVAS_BOUNDARY_DISPOSE__",
    "__HEARTH_CANVAS_G3_FAMILY_DISPOSE__",
    "__HEARTH_CANVAS_G3_ZONING_DISPOSE__",
    "__HEARTH_CANVAS_PLANET_BODY_DISPOSE__",
    "__HEARTH_CANVAS_VISIBLE_DISPOSE__",
    "__HEARTH_CANVAS_G3_10_DISPOSE__",
    "__HEARTH_CANVAS_G3_9_DISPOSE__",
    "__HEARTH_CANVAS_G3_8_DISPOSE__",
    "__HEARTH_CANVAS_G3_7_DISPOSE__",
    "__HEARTH_CANVAS_G3_6_DISPOSE__",
    "__HEARTH_CANVAS_G3_5_DISPOSE__",
    "__HEARTH_CANVAS_G3_4_DISPOSE__",
    "__HEARTH_CANVAS_G3_DISPOSE__",
    "__HEARTH_CANVAS_DISPOSE__",
    "__HEARTH_G2_DISPOSE__"
  ].forEach((name) => {
    if (typeof window[name] === "function") {
      try { window[name](); } catch (_) {}
    }
    try { window[name] = null; } catch (_) {}
  });

  const runtime = {
    disposed: false,
    mounted: false,
    raf: 0,
    lastFrame: 0,
    mount: null,
    canvas: null,
    ctx: null,
    buffer: null,
    bufferCtx: null,
    image: null,
    size: 0,
    observer: null
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => Math.round(lerp(a, b, clamp(t, 0, 1)));

  function smoothstep(a, b, x) {
    const t = clamp((x - a) / ((b - a) || 1e-9), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function norm3(v) {
    const m = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / m, v[1] / m, v[2] / m];
  }

  function rotateX(v, a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
  }

  function rotateY(v, a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
  }

  function fallbackTerrainSample() {
    return {
      land: false,
      waterDepth: 0.8,
      shelf: 0,
      coast: 0,
      countryBoundary: 0,
      summitBoundary: 0,
      citySeat: 0,
      color: [142, 116, 72]
    };
  }

  function sampleTerrain(v) {
    if (window.HEARTH_TERRAIN && typeof window.HEARTH_TERRAIN.sampleVector === "function") {
      return window.HEARTH_TERRAIN.sampleVector(v);
    }

    return fallbackTerrainSample(v);
  }

  function sampleHydration(v, terrainSample) {
    if (window.HEARTH_HYDRATION && typeof window.HEARTH_HYDRATION.sampleVector === "function") {
      return window.HEARTH_HYDRATION.sampleVector(v, terrainSample);
    }

    return {
      water: !terrainSample.land,
      passiveOnly: true,
      color: [14, 86, 130],
      colorShift: { r: 0, g: 0, b: 0 }
    };
  }

  function colorLand(terrain, limbFade) {
    const base = terrain.color || [142, 116, 72];
    let r = base[0];
    let g = base[1];
    let b = base[2];

    const summitRank = clamp(((terrain.summit || 1) - 1) / 8, 0, 1);
    r = mix(r, 202, summitRank * 0.18);
    g = mix(g, 170, summitRank * 0.14);
    b = mix(b, 102, summitRank * 0.08);

    const country = clamp(terrain.countryBoundary || 0, 0, 1) * limbFade;
    r = mix(r, 60, country * 0.36);
    g = mix(g, 72, country * 0.36);
    b = mix(b, 62, country * 0.36);

    const summit = clamp(terrain.summitBoundary || 0, 0, 1) * limbFade;
    r = mix(r, 232, summit * 0.24);
    g = mix(g, 200, summit * 0.22);
    b = mix(b, 118, summit * 0.12);

    const city = clamp(terrain.citySeat || 0, 0, 1) * limbFade;
    r = mix(r, 245, city * 0.62);
    g = mix(g, 232, city * 0.50);
    b = mix(b, 174, city * 0.36);

    const coast = clamp(terrain.coast || 0, 0, 1);
    r = mix(r, 205, coast * 0.08);
    g = mix(g, 188, coast * 0.07);
    b = mix(b, 130, coast * 0.06);

    return [r, g, b];
  }

  function colorWater(hydration, terrain) {
    if (hydration && Array.isArray(hydration.color)) return hydration.color.slice(0, 3);

    const depth = clamp(terrain.waterDepth || 0.8, 0, 1);
    const shelf = clamp(terrain.shelf || 0, 0, 1);
    const coast = clamp(terrain.coast || 0, 0, 1);

    let r = mix(14, 4, depth);
    let g = mix(86, 44, depth);
    let b = mix(130, 108, depth);

    r = mix(r, 32, shelf * 0.74);
    g = mix(g, 155, shelf * 0.72);
    b = mix(b, 174, shelf * 0.70);

    r = mix(r, 34, coast * 0.16);
    g = mix(g, 168, coast * 0.20);
    b = mix(b, 184, coast * 0.18);

    return [r, g, b];
  }

  function installStyle() {
    const old = document.getElementById("hearth-boundary-canvas-style");
    if (old) old.remove();

    const style = document.createElement("style");
    style.id = "hearth-boundary-canvas-style";
    style.textContent = `
      html,
      body {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        touch-action: pan-y !important;
        -webkit-overflow-scrolling: touch !important;
      }

      #hearthCanvasMount,
      [data-hearth-mount] {
        position: relative;
        overflow: hidden;
        isolation: isolate;
        touch-action: pan-y !important;
      }

      #hearthCanvasMount canvas[data-hearth-canvas],
      [data-hearth-mount] canvas[data-hearth-canvas] {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        touch-action: pan-y !important;
      }
    `;

    document.head.appendChild(style);
  }

  function unlockScroll() {
    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.overflowY = "auto";
    document.documentElement.style.touchAction = "pan-y";

    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "auto";
    document.body.style.touchAction = "pan-y";
    document.body.style.webkitOverflowScrolling = "touch";
  }

  function getMount() {
    const mount =
      document.getElementById("hearthCanvasMount") ||
      document.querySelector("[data-hearth-mount]") ||
      document.querySelector("[data-render='hearth']");

    if (mount) return mount;

    const fallback = document.createElement("section");
    fallback.id = "hearthCanvasMount";
    fallback.dataset.hearthMount = "true";
    fallback.style.position = "relative";
    fallback.style.width = "100%";
    fallback.style.aspectRatio = "1 / 1";
    fallback.style.minHeight = "300px";

    const parent = document.getElementById("hearth-main") || document.querySelector("main") || document.body;
    parent.appendChild(fallback);
    return fallback;
  }

  function resize() {
    if (!runtime.mount || !runtime.canvas || !runtime.buffer || !runtime.bufferCtx) return;

    const rect = runtime.mount.getBoundingClientRect();
    const cssSize = Math.max(
      MIN_SIZE,
      Math.floor(Math.min(rect.width || MIN_SIZE, rect.height || rect.width || MIN_SIZE))
    );

    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    const px = Math.max(MIN_SIZE, Math.floor(cssSize * dpr));
    const workSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, px));

    runtime.canvas.width = px;
    runtime.canvas.height = px;

    if (runtime.size !== workSize) {
      runtime.size = workSize;
      runtime.buffer.width = workSize;
      runtime.buffer.height = workSize;
      runtime.image = runtime.bufferCtx.createImageData(workSize, workSize);
    }
  }

  function paintBackplate(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(w * 0.5, h * 0.48, w * 0.04, w * 0.5, h * 0.5, w * 0.68);
    bg.addColorStop(0, "rgba(42, 85, 116, 0.15)");
    bg.addColorStop(0.55, "rgba(12, 30, 52, 0.52)");
    bg.addColorStop(1, "rgba(2, 7, 15, 1)");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }

  function paintPlanet(time) {
    const size = runtime.size;
    const image = runtime.image;

    if (!size || !image) return;

    const data = image.data;
    data.fill(0);

    const cx = size * 0.5;
    const cy = size * 0.505;
    const radius = size * 0.405;

    const spin = time * 0.000041;
    const tilt = -0.10;

    const yMin = Math.max(0, Math.floor(cy - radius - 2));
    const yMax = Math.min(size - 1, Math.ceil(cy + radius + 2));
    const xMin = Math.max(0, Math.floor(cx - radius - 2));
    const xMax = Math.min(size - 1, Math.ceil(cx + radius + 2));

    for (let y = yMin; y <= yMax; y += 1) {
      const sy = (y - cy) / radius;
      const sy2 = sy * sy;

      for (let x = xMin; x <= xMax; x += 1) {
        const sx = (x - cx) / radius;
        const d2 = sx * sx + sy2;

        if (d2 > 1) continue;

        const z = Math.sqrt(1 - d2);
        const limbFade = smoothstep(0.18, 0.42, z);

        let v = [sx, -sy, z];
        v = rotateX(v, tilt);
        v = rotateY(v, spin);
        v = norm3(v);

        const terrain = sampleTerrain(v);
        const hydration = sampleHydration(v, terrain);

        let c = terrain.land ? colorLand(terrain, limbFade) : colorWater(hydration, terrain);

        if (terrain.land && hydration && hydration.colorShift) {
          c[0] += hydration.colorShift.r || 0;
          c[1] += hydration.colorShift.g || 0;
          c[2] += hydration.colorShift.b || 0;
        }

        const bodyCurve = 0.988 + Math.pow(z, 1.08) * 0.032;
        c[0] *= bodyCurve;
        c[1] *= bodyCurve;
        c[2] *= bodyCurve;

        const edge = Math.pow(1 - z, 1.85);
        c[0] = mix(c[0], 62, edge * 0.030);
        c[1] = mix(c[1], 132, edge * 0.036);
        c[2] = mix(c[2], 178, edge * 0.045);

        const alpha = smoothstep(1.01, 0.985, d2);
        const out = (y * size + x) * 4;

        data[out] = clamp(c[0], 0, 255);
        data[out + 1] = clamp(c[1], 0, 255);
        data[out + 2] = clamp(c[2], 0, 255);
        data[out + 3] = Math.round(alpha * 255);
      }
    }
  }

  function composite(time) {
    const canvas = runtime.canvas;
    const ctx = runtime.ctx;
    const buffer = runtime.buffer;
    const bufferCtx = runtime.bufferCtx;

    if (!canvas || !ctx || !buffer || !bufferCtx || !runtime.image) return;

    const w = canvas.width;
    const h = canvas.height;
    if (!w || !h) return;

    paintBackplate(ctx, w, h);
    paintPlanet(time);

    bufferCtx.clearRect(0, 0, runtime.size, runtime.size);
    bufferCtx.putImageData(runtime.image, 0, 0);

    const target = Math.min(w, h);
    const dx = (w - target) * 0.5;
    const dy = (h - target) * 0.5;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(buffer, dx, dy, target, target);
    ctx.restore();
  }

  function loop(time) {
    if (runtime.disposed) return;

    if (!runtime.lastFrame || time - runtime.lastFrame > 42) {
      runtime.lastFrame = time;
      composite(time);
    }

    runtime.raf = requestAnimationFrame(loop);
  }

  function exposeReceipt(status) {
    const terrainReceipt =
      window.HEARTH_TERRAIN && typeof window.HEARTH_TERRAIN.receipt === "function"
        ? window.HEARTH_TERRAIN.receipt()
        : null;

    const hydrationReceipt =
      window.HEARTH_HYDRATION && typeof window.HEARTH_HYDRATION.receipt === "function"
        ? window.HEARTH_HYDRATION.receipt()
        : null;

    window.HEARTH_CANVAS_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      familyContract: FAMILY_CONTRACT,
      version: VERSION,
      route: location.pathname,
      renderOwner: "/assets/hearth/hearth.canvas.js",
      terrainOwner: "/assets/hearth/hearth.terrain.js",
      hydrationOwner: "/assets/hearth/hearth.hydration.js",
      mount: "#hearthCanvasMount",
      generation: "G3",
      standard: "boundary-aligned-landmass-family",
      languageLayer: "globe",
      constructionLayer: "planet",
      drawPath: "single-visible-draw-path",
      generalRegions: 4,
      countries: 16,
      summitRegionsPerGeneralRegion: 9,
      totalSummitRegions: 36,
      terrainReceipt,
      hydrationReceipt,
      ticTacToeDynamicProtocol: TIC_TAC_TOE_DYNAMIC_PROTOCOL,
      systemicQuadAAttack: SYSTEMIC_QUAD_A_ATTACK,
      retired: [
        "G2 model restore",
        "G3.4 terrain authority",
        "G3.7 hydration engine",
        "G3.9 true sphere composition",
        "G3.10 chain alignment",
        "round-blob landmass standard",
        "hydration-first path",
        "terrain-detail-first path"
      ],
      deferred: [
        "hydration expansion",
        "rivers",
        "mountains",
        "terrain detail",
        "weather",
        "climate",
        "clouds",
        "humidity",
        "atmospheric moisture"
      ],
      noGraphicBox: true,
      noGeneratedImage: true,
      noExternalImage: true,
      noDecorativeGlobeTemplate: true,
      noDuplicateDrawPath: true,
      status
    });
  }

  async function mount() {
    installStyle();
    unlockScroll();

    const mountEl = getMount();
    mountEl.replaceChildren();

    const canvas = document.createElement("canvas");
    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.contract = CONTRACT;
    canvas.dataset.familyContract = FAMILY_CONTRACT;
    canvas.dataset.generation = "G3";
    canvas.dataset.standard = "boundary-aligned-landmass-family";
    canvas.dataset.languageLayer = "globe";
    canvas.dataset.constructionLayer = "planet";
    canvas.dataset.drawPath = "single-visible-draw-path";
    canvas.dataset.generalRegions = "4";
    canvas.dataset.countries = "16";
    canvas.dataset.summitRegionsPerGeneralRegion = "9";
    canvas.dataset.hydrationDeferred = "true";
    canvas.dataset.terrainDetailDeferred = "true";
    canvas.dataset.mountainsDeferred = "true";
    canvas.dataset.climateWeatherCloudsDeferred = "true";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth Generation 3 boundary-aligned landmass-family planet");

    mountEl.append(canvas);

    runtime.mount = mountEl;
    runtime.canvas = canvas;
    runtime.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    runtime.buffer = document.createElement("canvas");
    runtime.bufferCtx = runtime.buffer.getContext("2d", { alpha: true, willReadFrequently: false });

    mountEl.dataset.hearthCanvasContract = CONTRACT;
    mountEl.dataset.hearthFamilyContract = FAMILY_CONTRACT;
    mountEl.dataset.hearthCanvasReceipt = RECEIPT;
    mountEl.dataset.hearthGeneration = "G3";
    mountEl.dataset.hearthStandard = "boundary-aligned-landmass-family";
    mountEl.dataset.hearthLanguageLayer = "globe";
    mountEl.dataset.hearthConstructionLayer = "planet";
    mountEl.dataset.hearthDrawPath = "single-visible-draw-path";

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasFamilyContract = FAMILY_CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthGeneration = "G3";
    document.documentElement.dataset.hearthStandard = "boundary-aligned-landmass-family";
    document.documentElement.dataset.hearthLanguageLayer = "globe";
    document.documentElement.dataset.hearthConstructionLayer = "planet";
    document.documentElement.dataset.hearthDrawPath = "single-visible-draw-path";

    runtime.observer = new ResizeObserver(resize);
    runtime.observer.observe(mountEl);

    window.addEventListener("resize", resize, { passive: true });

    resize();
    exposeReceipt("mounted");

    runtime.mounted = true;
    runtime.raf = requestAnimationFrame(loop);
  }

  function dispose() {
    runtime.disposed = true;
    cancelAnimationFrame(runtime.raf);
    window.removeEventListener("resize", resize);

    if (runtime.observer) runtime.observer.disconnect();

    const style = document.getElementById("hearth-boundary-canvas-style");
    if (style) style.remove();

    if (runtime.mount) runtime.mount.replaceChildren();

    window.__HEARTH_CANVAS_BOUNDARY_DISPOSE__ = null;
    exposeReceipt("disposed");
  }

  window.__HEARTH_CANVAS_BOUNDARY_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_FAMILY_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_ZONING_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_PLANET_BODY_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_VISIBLE_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_10_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_9_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_8_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_7_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_6_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_5_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_4_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_DISPOSE__ = dispose;

  function boot() {
    if (runtime.mounted || runtime.disposed) return;
    mount();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
