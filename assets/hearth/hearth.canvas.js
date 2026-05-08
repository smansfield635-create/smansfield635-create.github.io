// /assets/hearth/hearth.canvas.js
// HEARTH_G3_PLANET_BODY_SINGLE_DRAW_PATH_FULL_REPLACEMENT_TNT_v1
// Full-file replacement.
// Contract renewal standard.
// Purpose:
// - Build Hearth as a planet-body renderer, not a decorative globe renderer.
// - Enforce one visible draw path.
// - paintPlanet prepares offscreen image data only.
// - composite is the only function allowed to draw onto the visible canvas.
// - Remove duplicate planet / side-body artifact.
// - Preserve G3 scope: planet body, terrain, ocean, shelves, bathymetry, frozen storage, surface hydrology.
// - Exclude G4 scope: clouds, weather, climate, humidity, atmospheric moisture.
// - No external image. No generated image. No GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_PLANET_BODY_SINGLE_DRAW_PATH_FULL_REPLACEMENT_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-planet-body-single-draw-path";
  const RECEIPT = "HEARTH_G3_PLANET_BODY_SINGLE_DRAW_PATH_RECEIPT";

  const MIN_SIZE = 300;
  const MAX_SIZE = 520;
  const TAU = Math.PI * 2;

  [
    "__HEARTH_CANVAS_PLANET_BODY_DISPOSE__",
    "__HEARTH_CANVAS_VISIBLE_DISPOSE__",
    "__HEARTH_CANVAS_G3_DISPOSE__",
    "__HEARTH_CANVAS_G3_10_DISPOSE__",
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

  function dot3(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
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

  function dirFromLonLat(lonDeg, latDeg) {
    const lon = lonDeg * Math.PI / 180;
    const lat = latDeg * Math.PI / 180;
    const cl = Math.cos(lat);
    return [cl * Math.sin(lon), Math.sin(lat), cl * Math.cos(lon)];
  }

  function hash3(x, y, z, seed = 0) {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed * 191.9) * 43758.5453123;
    return n - Math.floor(n);
  }

  function noise3(x, y, z, seed = 0) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const iz = Math.floor(z);

    const fx = x - ix;
    const fy = y - iy;
    const fz = z - iz;

    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    const uz = fz * fz * (3 - 2 * fz);

    const c000 = hash3(ix, iy, iz, seed);
    const c100 = hash3(ix + 1, iy, iz, seed);
    const c010 = hash3(ix, iy + 1, iz, seed);
    const c110 = hash3(ix + 1, iy + 1, iz, seed);
    const c001 = hash3(ix, iy, iz + 1, seed);
    const c101 = hash3(ix + 1, iy, iz + 1, seed);
    const c011 = hash3(ix, iy + 1, iz + 1, seed);
    const c111 = hash3(ix + 1, iy + 1, iz + 1, seed);

    const x00 = lerp(c000, c100, ux);
    const x10 = lerp(c010, c110, ux);
    const x01 = lerp(c001, c101, ux);
    const x11 = lerp(c011, c111, ux);

    const y0 = lerp(x00, x10, uy);
    const y1 = lerp(x01, x11, uy);

    return lerp(y0, y1, uz);
  }

  function fbm3(v, scale, seed, octaves) {
    let sum = 0;
    let amp = 0.52;
    let freq = scale;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      sum += noise3(v[0] * freq, v[1] * freq, v[2] * freq, seed + i * 23.19) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= 2.04;
    }

    return norm ? sum / norm : 0.5;
  }

  const LAND_CORES = Object.freeze([
    { c: dirFromLonLat(-92, 18), r: 0.52, a: 0.96 },
    { c: dirFromLonLat(-53, -10), r: 0.44, a: 0.82 },
    { c: dirFromLonLat(-20, -46), r: 0.30, a: 0.56 },
    { c: dirFromLonLat(18, 28), r: 0.62, a: 0.98 },
    { c: dirFromLonLat(64, 17), r: 0.50, a: 0.78 },
    { c: dirFromLonLat(103, 41), r: 0.55, a: 0.76 },
    { c: dirFromLonLat(118, -30), r: 0.37, a: 0.72 },
    { c: dirFromLonLat(158, -44), r: 0.16, a: 0.38 },
    { c: dirFromLonLat(-146, 49), r: 0.31, a: 0.52 }
  ]);

  const SEA_CUTS = Object.freeze([
    { c: dirFromLonLat(-6, 6), r: 0.28, a: 0.46 },
    { c: dirFromLonLat(78, -2), r: 0.33, a: 0.34 },
    { c: dirFromLonLat(-122, 0), r: 0.28, a: 0.30 },
    { c: dirFromLonLat(32, -12), r: 0.22, a: 0.22 }
  ]);

  function sphericalBlob(v, core) {
    const d = dot3(v, core.c);
    const edge = Math.cos(core.r);
    return smoothstep(edge, 1, d) * core.a;
  }

  function samplePlanetBody(v) {
    let field = -0.58;

    for (const core of LAND_CORES) field += sphericalBlob(v, core);
    for (const cut of SEA_CUTS) field -= sphericalBlob(v, cut);

    const macro = fbm3(v, 2.4, 18.31, 5);
    const meso = fbm3(v, 7.2, 74.22, 4);
    const fine = fbm3(v, 18.0, 119.6, 3);

    field += (macro - 0.5) * 0.40;
    field += (meso - 0.5) * 0.18;
    field += (fine - 0.5) * 0.06;

    const land = field > 0;
    const coast = 1 - smoothstep(0.01, 0.105, Math.abs(field));
    const elevation = land ? clamp(field * 2.15, 0, 1) : 0;
    const depth = land ? 0 : clamp(-field * 1.92, 0, 1);
    const shelf = land ? 0 : clamp(coast * 0.96, 0, 1);

    const ridgeSeed = fbm3([v[0] + 0.21, v[1] - 0.08, v[2] + 0.13], 13.0, 301.8, 4);
    const ridgeThread = Math.abs(ridgeSeed - 0.5);
    const ridge = land ? (1 - smoothstep(0.04, 0.24, ridgeThread)) * smoothstep(0.22, 0.88, elevation) : 0;
    const mountain = land ? clamp(ridge * 0.68 + smoothstep(0.62, 0.92, elevation) * 0.30, 0, 1) : 0;

    const latitude = Math.asin(clamp(v[1], -1, 1)) * 180 / Math.PI;
    const latAbs = Math.abs(latitude);

    const moistureField = fbm3([v[0] - 0.37, v[1] + 0.19, v[2] + 0.07], 3.8, 422.4, 5);
    const moisture = clamp(
      0.46 +
      Math.cos((latitude / 90) * Math.PI) * 0.16 +
      (moistureField - 0.5) * 0.42 -
      elevation * 0.10,
      0,
      1
    );

    const aridityField = fbm3([v[0] + 0.62, v[1] - 0.44, v[2] + 0.29], 4.4, 512.7, 4);
    const aridity = land ? clamp(aridityField * 0.68 - moisture * 0.26, 0, 1) : 0;

    const basinField = fbm3([v[0] - 0.18, v[1] + 0.52, v[2] - 0.31], 9.0, 717.2, 4);
    const basin = land
      ? clamp(
          smoothstep(0.58, 0.88, basinField) *
          smoothstep(0.08, 0.54, 1 - Math.abs(elevation - 0.22)) *
          (0.34 + moisture * 0.42),
          0,
          1
        )
      : 0;

    const drainageField = fbm3([v[0] + 0.11, v[1] + 0.23, v[2] - 0.16], 16.0, 808.4, 3);
    const drainage = land
      ? clamp(
          (1 - smoothstep(0.025, 0.18, Math.abs(drainageField - 0.5))) *
          (0.18 + moisture * 0.30 + mountain * 0.18) +
          coast * 0.12 +
          basin * 0.16,
          0,
          1
        )
      : 0;

    const frozen = land
      ? clamp(
          smoothstep(58, 82, latAbs) * 0.72 +
          mountain * smoothstep(0.55, 0.92, elevation) * 0.44,
          0,
          1
        )
      : 0;

    const wetness = land
      ? clamp(coast * 0.46 + basin * 0.34 + drainage * 0.24 + moisture * 0.16, 0, 1)
      : clamp(shelf * 0.58 + coast * 0.18, 0, 1);

    return {
      land,
      coast,
      elevation,
      depth,
      shelf,
      mountain,
      moisture,
      aridity,
      basin,
      drainage,
      frozen,
      wetness,
      roughness: clamp(fine * 0.62 + meso * 0.38, 0, 1)
    };
  }

  function colorPlanet(s) {
    if (s.land) {
      const green = clamp((s.moisture - 0.24) * 1.24 - s.aridity * 0.22, 0, 1);
      const high = clamp(s.elevation, 0, 1);
      const wet = clamp(s.wetness, 0, 1);

      let r = mix(154, 54, green);
      let g = mix(124, 134, green);
      let b = mix(72, 84, green);

      r = mix(r, 188, s.aridity * 0.42);
      g = mix(g, 150, s.aridity * 0.34);
      b = mix(b, 92, s.aridity * 0.26);

      r = mix(r, 116, high * 0.20);
      g = mix(g, 112, high * 0.17);
      b = mix(b, 102, high * 0.14);

      r = mix(r, 88, s.mountain * 0.36);
      g = mix(g, 88, s.mountain * 0.34);
      b = mix(b, 88, s.mountain * 0.32);

      r = mix(r, 40, wet * 0.17);
      g = mix(g, 148, wet * 0.22);
      b = mix(b, 142, wet * 0.21);

      r = mix(r, 238, s.frozen * 0.72);
      g = mix(g, 244, s.frozen * 0.72);
      b = mix(b, 240, s.frozen * 0.72);

      return [r, g, b];
    }

    const abyss = smoothstep(0.62, 1, s.depth);
    const reef = s.shelf * smoothstep(0.40, 0.82, s.wetness);

    let r = mix(24, 4, s.depth);
    let g = mix(118, 50, s.depth);
    let b = mix(166, 128, s.depth);

    r = mix(r, 38, s.shelf * 0.92);
    g = mix(g, 206, s.shelf * 0.88);
    b = mix(b, 210, s.shelf * 0.84);

    r = mix(r, 6, abyss * 0.24);
    g = mix(g, 38, abyss * 0.20);
    b = mix(b, 102, abyss * 0.18);

    r = mix(r, 76, reef * 0.24);
    g = mix(g, 214, reef * 0.34);
    b = mix(b, 198, reef * 0.30);

    return [r, g, b];
  }

  function installStyle() {
    const old = document.getElementById("hearth-single-draw-planet-style");
    if (old) old.remove();

    const style = document.createElement("style");
    style.id = "hearth-single-draw-planet-style";
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
    bg.addColorStop(0, "rgba(42,85,116,0.16)");
    bg.addColorStop(0.54, "rgba(12,30,52,0.54)");
    bg.addColorStop(1, "rgba(2,7,15,1)");

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

    const spin = time * 0.000045;
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

        let v = [sx, -sy, z];
        v = rotateX(v, tilt);
        v = rotateY(v, spin);
        v = norm3(v);

        const s = samplePlanetBody(v);
        let [rr, gg, bb] = colorPlanet(s);

        const bodyCurve = 0.985 + Math.pow(z, 1.08) * 0.035;
        const bodyRelief = s.land
          ? clamp(0.96 + s.elevation * 0.025 + s.mountain * 0.030 + (s.roughness - 0.5) * 0.040, 0.91, 1.09)
          : clamp(0.99 - s.depth * 0.012 + s.shelf * 0.018, 0.97, 1.02);

        rr *= bodyCurve * bodyRelief;
        gg *= bodyCurve * bodyRelief;
        bb *= bodyCurve * bodyRelief;

        const edge = Math.pow(1 - z, 1.85);
        rr = mix(rr, 66, edge * 0.030);
        gg = mix(gg, 142, edge * 0.036);
        bb = mix(bb, 188, edge * 0.045);

        const alpha = smoothstep(1.01, 0.985, d2);
        const out = (y * size + x) * 4;

        data[out] = clamp(rr, 0, 255);
        data[out + 1] = clamp(gg, 0, 255);
        data[out + 2] = clamp(bb, 0, 255);
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
    window.HEARTH_CANVAS_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      route: location.pathname,
      renderOwner: "/assets/hearth/hearth.canvas.js",
      mount: "#hearthCanvasMount",
      generation: "G3",
      contractRenewal: true,
      newStandard: "planet-body-template",
      languageLayer: "globe",
      constructionLayer: "planet",
      drawPath: "single-visible-draw-path",
      paintPlanetWritesVisibleCanvas: false,
      compositeWritesVisibleCanvas: true,
      duplicatePlanetPrevented: true,
      renderPolicy: "3D planet-body surface field; no flat map wrap; no decorative globe shell",
      noHemisphereMask: true,
      noTwoPieceShell: true,
      noDisplayRings: true,
      noGraphicBox: true,
      noGeneratedImage: true,
      g4Deferred: "clouds-weather-climate-humidity-atmospheric-moisture",
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
    canvas.dataset.generation = "G3";
    canvas.dataset.renderTemplate = "planet-body";
    canvas.dataset.languageLayer = "globe";
    canvas.dataset.constructionLayer = "planet";
    canvas.dataset.drawPath = "single-visible-draw-path";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth Generation 3 planet body");

    mountEl.append(canvas);

    runtime.mount = mountEl;
    runtime.canvas = canvas;
    runtime.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    runtime.buffer = document.createElement("canvas");
    runtime.bufferCtx = runtime.buffer.getContext("2d", { alpha: true, willReadFrequently: false });

    mountEl.dataset.hearthCanvasContract = CONTRACT;
    mountEl.dataset.hearthCanvasReceipt = RECEIPT;
    mountEl.dataset.hearthGeneration = "G3";
    mountEl.dataset.hearthContractRenewal = "true";
    mountEl.dataset.hearthRenderTemplate = "planet-body";
    mountEl.dataset.hearthLanguageLayer = "globe";
    mountEl.dataset.hearthConstructionLayer = "planet";
    mountEl.dataset.hearthDrawPath = "single-visible-draw-path";

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthGeneration = "G3";
    document.documentElement.dataset.hearthContractRenewal = "true";
    document.documentElement.dataset.hearthRenderTemplate = "planet-body";
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

    const style = document.getElementById("hearth-single-draw-planet-style");
    if (style) style.remove();

    if (runtime.mount) runtime.mount.replaceChildren();

    window.__HEARTH_CANVAS_PLANET_BODY_DISPOSE__ = null;
    exposeReceipt("disposed");
  }

  window.__HEARTH_CANVAS_PLANET_BODY_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_VISIBLE_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_10_DISPOSE__ = dispose;
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
