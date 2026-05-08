// /assets/hearth/hearth.canvas.js
// HEARTH_G2_MODEL_RESTORE_CANVAS_TNT_v1
// Full-file replacement.
// Purpose:
// - Restore the advanced Hearth G2 procedural model.
// - Mount only into #hearthCanvasMount / [data-hearth-mount].
// - No Earth placeholder.
// - No JPG. No NASA asset. No generated image.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G2_MODEL_RESTORE_CANVAS_TNT_v1";
  const VERSION = "2026-05-08.hearth-g2-advanced-model-restored";
  const RECEIPT = "HEARTH_G2_ADVANCED_MODEL_RESTORED_RECEIPT";

  const MAP_W = 896;
  const MAP_H = 448;
  const MAX_RENDER_SIZE = 560;
  const MIN_RENDER_SIZE = 280;
  const TAU = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  if (typeof window.__HEARTH_CANVAS_G2_DISPOSE__ === "function") {
    try { window.__HEARTH_CANVAS_G2_DISPOSE__(); } catch (_) {}
  }

  const runtime = {
    raf: 0,
    resizeObserver: null,
    mounted: false,
    disposed: false,
    lastFrame: 0,
    mount: null,
    canvas: null,
    ctx: null,
    work: null,
    workCtx: null,
    image: null,
    size: 0,
    map: null
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => Math.round(lerp(a, b, clamp(t, 0, 1)));

  function smoothstep(a, b, x) {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrapLon(lon) {
    let v = lon;
    while (v < -180) v += 360;
    while (v > 180) v -= 360;
    return v;
  }

  function lonDelta(a, b) {
    return wrapLon(a - b);
  }

  function normalize3(v) {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  }

  const LIGHT = normalize3([-0.48, -0.32, 0.82]);
  const HALF_LIGHT = normalize3([LIGHT[0], LIGHT[1], LIGHT[2] + 1.0]);

  function hash2(x, y, seed = 0) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function valueNoise(x, y, seed = 0) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    const a = hash2(ix, iy, seed);
    const b = hash2(ix + 1, iy, seed);
    const c = hash2(ix, iy + 1, seed);
    const d = hash2(ix + 1, iy + 1, seed);

    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }

  function fbm(x, y, seed = 0, octaves = 5) {
    let sum = 0;
    let amp = 0.5;
    let freq = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      sum += valueNoise(x * freq, y * freq, seed + i * 13.17) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= 2.03;
    }

    return norm ? sum / norm : 0;
  }

  const CONTINENT_SEEDS = [
    { lon: -103, lat: 48, rx: 42, ry: 26, amp: 1.10 },
    { lon: -84, lat: 20, rx: 22, ry: 16, amp: 0.58 },
    { lon: -60, lat: -16, rx: 25, ry: 38, amp: 0.95 },
    { lon: 20, lat: 4, rx: 28, ry: 36, amp: 0.92 },
    { lon: 78, lat: 50, rx: 72, ry: 30, amp: 1.16 },
    { lon: 98, lat: 23, rx: 42, ry: 24, amp: 0.75 },
    { lon: 135, lat: -25, rx: 22, ry: 16, amp: 0.72 },
    { lon: -42, lat: 74, rx: 18, ry: 10, amp: 0.54 },
    { lon: 0, lat: -82, rx: 180, ry: 11, amp: 0.92 },
    { lon: 45, lat: -48, rx: 18, ry: 9, amp: 0.35 }
  ];

  function continentField(lon, lat) {
    let v = 0;

    for (const c of CONTINENT_SEEDS) {
      const dx = lonDelta(lon, c.lon) / c.rx;
      const dy = (lat - c.lat) / c.ry;
      const q = 1 - (dx * dx + dy * dy);
      v += c.amp * smoothstep(-0.18, 0.86, q);
    }

    return v;
  }

  function makeTexture() {
    const len = MAP_W * MAP_H;
    const r = new Uint8ClampedArray(len);
    const g = new Uint8ClampedArray(len);
    const b = new Uint8ClampedArray(len);
    const land = new Uint8ClampedArray(len);
    const coast = new Uint8ClampedArray(len);
    const cloud = new Uint8ClampedArray(len);
    const height = new Float32Array(len);

    for (let y = 0; y < MAP_H; y += 1) {
      const lat = 90 - (y / (MAP_H - 1)) * 180;
      const latAbs = Math.abs(lat);

      for (let x = 0; x < MAP_W; x += 1) {
        const lon = (x / MAP_W) * 360 - 180;
        const idx = y * MAP_W + x;
        const nx = x / MAP_W;
        const ny = y / MAP_H;

        const plate = continentField(lon, lat);
        const broad = (fbm(nx * 7.5, ny * 5.2, 2.1, 5) - 0.5) * 0.26;
        const ridge = (fbm(nx * 24 + 7, ny * 18 - 3, 6.4, 4) - 0.5) * 0.15;
        const micro = (fbm(nx * 80, ny * 55, 9.7, 3) - 0.5) * 0.035;
        const polarPress = latAbs > 63 ? ((latAbs - 63) / 27) * 0.035 : 0;
        const h = plate + broad + ridge + micro + polarPress - 0.43;

        height[idx] = h;

        const isLand = h > 0;
        land[idx] = isLand ? 255 : 0;

        const coastBand = 1 - smoothstep(0.015, 0.145, Math.abs(h));
        coast[idx] = Math.round(coastBand * 255);

        const terrainNoise = fbm(nx * 45 + 11, ny * 35 - 2, 13.9, 4);
        const veinNoise = fbm(nx * 140, ny * 85, 18.4, 2);
        const iceLat = smoothstep(64, 84, latAbs);
        const snowHigh = isLand ? smoothstep(0.38, 0.82, h + terrainNoise * 0.18) : 0;
        const glacier = clamp(iceLat * 0.88 + snowHigh * 0.42, 0, 1);

        if (isLand) {
          const elevation = clamp(h * 1.85, 0, 1);
          const arid = smoothstep(8, 31, Math.abs(lat)) * (1 - smoothstep(31, 58, Math.abs(lat)));
          const wet = fbm(nx * 13 - 4, ny * 8 + 5, 22.5, 4);
          const green = clamp((wet - 0.28) * 1.35 * (1 - arid * 0.45), 0, 1);
          const mountain = smoothstep(0.38, 0.82, elevation + ridge * 1.8);
          const mineral = smoothstep(0.55, 0.9, veinNoise);

          let rr = mix(126, 42, green);
          let gg = mix(102, 112, green);
          let bb = mix(58, 64, green);

          rr = mix(rr, 170, arid * 0.45);
          gg = mix(gg, 136, arid * 0.35);
          bb = mix(bb, 86, arid * 0.28);

          rr = mix(rr, 114, mountain * 0.5);
          gg = mix(gg, 108, mountain * 0.48);
          bb = mix(bb, 100, mountain * 0.54);

          rr = mix(rr, 188, mineral * mountain * 0.18);
          gg = mix(gg, 178, mineral * mountain * 0.15);
          bb = mix(bb, 150, mineral * mountain * 0.14);

          rr = mix(rr, 223, glacier * 0.78);
          gg = mix(gg, 229, glacier * 0.78);
          bb = mix(bb, 218, glacier * 0.78);

          const shore = smoothstep(0, 0.055, h) * (1 - smoothstep(0.055, 0.2, h));
          rr = mix(rr, 190, shore * 0.35);
          gg = mix(gg, 171, shore * 0.3);
          bb = mix(bb, 122, shore * 0.25);

          const grain = (terrainNoise - 0.5) * 22;

          r[idx] = clamp(rr + grain, 0, 255);
          g[idx] = clamp(gg + grain * 0.85, 0, 255);
          b[idx] = clamp(bb + grain * 0.65, 0, 255);
        } else {
          const depth = clamp(-h * 2.35, 0, 1);
          const shelf = 1 - smoothstep(0.025, 0.18, -h);
          const current = fbm(nx * 34 + 18, ny * 19 - 7, 31.6, 4);
          const abyss = fbm(nx * 9, ny * 7, 35, 5);

          let rr = mix(11, 0, depth);
          let gg = mix(84, 24, depth);
          let bb = mix(128, 72, depth);

          rr = mix(rr, 33, shelf * 0.72);
          gg = mix(gg, 151, shelf * 0.7);
          bb = mix(bb, 159, shelf * 0.68);

          rr = mix(rr, 3, abyss * depth * 0.4);
          gg = mix(gg, 39, abyss * depth * 0.3);
          bb = mix(bb, 101, abyss * depth * 0.28);

          const flow = (current - 0.5) * 18;

          r[idx] = clamp(rr + flow * 0.22, 0, 255);
          g[idx] = clamp(gg + flow * 0.58, 0, 255);
          b[idx] = clamp(bb + flow, 0, 255);
        }

        const cloudA = fbm(nx * 15 + 3.5, ny * 9 - 2, 51.1, 5);
        const cloudB = fbm(nx * 42 - 9, ny * 26 + 8, 58.3, 3);
        const band = 0.64 + 0.12 * Math.sin((lat + 8) * Math.PI / 22) + 0.07 * Math.sin((lon - 25) * Math.PI / 31);
        const cval = smoothstep(band, 0.91, cloudA * 0.72 + cloudB * 0.28);
        const stormBelt = smoothstep(0, 38, 38 - Math.abs(lat)) * 0.42;

        cloud[idx] = Math.round(clamp(cval + stormBelt * smoothstep(0.7, 0.92, cloudB), 0, 1) * 255);
      }
    }

    return { r, g, b, land, coast, cloud, height };
  }

  function sampleIndex(lonRad, latRad, xShift = 0) {
    let u = ((lonRad + Math.PI) / TAU + xShift) % 1;
    if (u < 0) u += 1;

    const v = clamp((HALF_PI - latRad) / Math.PI, 0, 0.999999);
    const x = Math.floor(u * MAP_W) % MAP_W;
    const y = Math.floor(v * MAP_H);

    return y * MAP_W + x;
  }

  function getMount() {
    const mount =
      document.getElementById("hearthCanvasMount") ||
      document.querySelector("[data-hearth-mount]") ||
      document.querySelector("[data-render='hearth']");

    if (mount) return mount;

    const main = document.querySelector("main") || document.body;
    const fallback = document.createElement("section");
    fallback.id = "hearthCanvasMount";
    fallback.dataset.hearthMount = "";
    fallback.dataset.hearthFallbackMount = "true";
    fallback.dataset.contract = CONTRACT;
    fallback.style.width = "100%";
    fallback.style.aspectRatio = "1 / 1";
    fallback.style.minHeight = "280px";
    main.appendChild(fallback);
    return fallback;
  }

  function installStyle() {
    const prior = document.getElementById("hearth-g2-model-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-g2-model-style";
    style.textContent = `
      #hearthCanvasMount,
      [data-hearth-mount] {
        position: relative;
        overflow: hidden;
        isolation: isolate;
      }

      #hearthCanvasMount canvas[data-hearth-canvas],
      [data-hearth-mount] canvas[data-hearth-canvas] {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        touch-action: manipulation;
      }
    `;

    document.head.appendChild(style);
  }

  function resize() {
    if (!runtime.mount || !runtime.canvas) return;

    const rect = runtime.mount.getBoundingClientRect();
    const cssSize = Math.max(
      MIN_RENDER_SIZE,
      Math.floor(Math.min(rect.width || MIN_RENDER_SIZE, rect.height || rect.width || MIN_RENDER_SIZE))
    );

    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    const px = Math.max(MIN_RENDER_SIZE, Math.floor(cssSize * dpr));
    const workSize = Math.max(MIN_RENDER_SIZE, Math.min(MAX_RENDER_SIZE, px));

    runtime.canvas.width = px;
    runtime.canvas.height = px;

    if (runtime.size !== workSize) {
      runtime.size = workSize;
      runtime.work.width = workSize;
      runtime.work.height = workSize;
      runtime.image = runtime.workCtx.createImageData(workSize, workSize);
    }
  }

  function paintBackplate(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(w * 0.5, h * 0.45, w * 0.06, w * 0.5, h * 0.5, w * 0.66);
    bg.addColorStop(0, "rgba(37, 81, 113, 0.32)");
    bg.addColorStop(0.55, "rgba(13, 32, 54, 0.72)");
    bg.addColorStop(1, "rgba(3, 8, 17, 1)");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.5;
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.0011);

    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, w * (0.392 + i * 0.033), 0, TAU);
      ctx.strokeStyle = `rgba(102, 174, 225, ${0.09 - i * 0.018 + pulse * 0.012})`;
      ctx.lineWidth = Math.max(1, w * (0.006 - i * 0.0009));
      ctx.stroke();
    }
  }

  function paintSphere(time) {
    const size = runtime.size;
    const image = runtime.image;
    const data = image.data;
    const map = runtime.map;

    if (!size || !image || !map) return;

    data.fill(0);

    const cx = size * 0.5;
    const cy = size * 0.505;
    const radius = size * 0.402;
    const spin = time * 0.000055;
    const cosA = Math.cos(spin);
    const sinA = Math.sin(spin);
    const cloudShift = (time * 0.000006) % 1;

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
        const nx = sx;
        const ny = -sy;
        const nz = z;

        const rx = nx * cosA + nz * sinA;
        const rz = -nx * sinA + nz * cosA;
        const lat = Math.asin(clamp(ny, -1, 1));
        const lon = Math.atan2(rx, rz);

        const idx = sampleIndex(lon, lat, 0);
        const cidx = sampleIndex(lon, lat, cloudShift);

        const isLand = map.land[idx] > 0;
        const coast = map.coast[idx] / 255;
        const cloud = map.cloud[cidx] / 255;
        const h = map.height[idx];

        let rr = map.r[idx];
        let gg = map.g[idx];
        let bb = map.b[idx];

        const light = clamp(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2], 0, 1);
        const shade = 0.38 + light * 0.68;
        const limb = Math.pow(1 - z, 1.65);

        if (!isLand && coast > 0.05) {
          const edgeOcean = Math.pow(coast, 1.15);
          rr = mix(rr, 42, edgeOcean * 0.28);
          gg = mix(gg, 172, edgeOcean * 0.38);
          bb = mix(bb, 183, edgeOcean * 0.34);
        }

        if (isLand && coast > 0.05) {
          rr = mix(rr, 156, coast * 0.16);
          gg = mix(gg, 146, coast * 0.14);
          bb = mix(bb, 112, coast * 0.12);
        }

        if (!isLand) {
          const specDot = clamp(nx * HALF_LIGHT[0] + ny * HALF_LIGHT[1] + nz * HALF_LIGHT[2], 0, 1);
          const spec = Math.pow(specDot, 62) * clamp(light + 0.15, 0, 1);

          rr = mix(rr, 210, spec * 0.42);
          gg = mix(gg, 230, spec * 0.38);
          bb = mix(bb, 248, spec * 0.34);
        }

        const cloudAlpha =
          smoothstep(0.28, 0.92, cloud) *
          (0.38 + 0.18 * light) *
          (1 - limb * 0.45);

        if (cloudAlpha > 0.01) {
          const cloudTone = isLand && h > 0.45 ? 224 : 236;
          rr = mix(rr, cloudTone, cloudAlpha);
          gg = mix(gg, cloudTone + 4, cloudAlpha);
          bb = mix(bb, 244, cloudAlpha);
        }

        rr *= shade;
        gg *= shade;
        bb *= shade;

        rr = mix(rr, 30, limb * 0.34);
        gg = mix(gg, 99, limb * 0.32);
        bb = mix(bb, 152, limb * 0.42);

        const atmosphere = Math.pow(limb, 2.4);
        rr = mix(rr, 42, atmosphere * 0.35);
        gg = mix(gg, 156, atmosphere * 0.48);
        bb = mix(bb, 224, atmosphere * 0.55);

        const alpha = smoothstep(1.01, 0.985, d2);
        const out = (y * size + x) * 4;

        data[out] = clamp(rr, 0, 255);
        data[out + 1] = clamp(gg, 0, 255);
        data[out + 2] = clamp(bb, 0, 255);
        data[out + 3] = Math.round(alpha * 255);
      }
    }

    runtime.workCtx.putImageData(image, 0, 0);

    const wctx = runtime.workCtx;

    wctx.save();
    wctx.globalCompositeOperation = "screen";

    const gx = wctx.createRadialGradient(
      cx - radius * 0.2,
      cy - radius * 0.36,
      radius * 0.05,
      cx,
      cy,
      radius * 0.58
    );

    gx.addColorStop(0, "rgba(255,255,255,0.22)");
    gx.addColorStop(0.26, "rgba(120,190,245,0.08)");
    gx.addColorStop(1, "rgba(0,0,0,0)");

    wctx.fillStyle = gx;
    wctx.beginPath();
    wctx.arc(cx, cy, radius, 0, TAU);
    wctx.fill();
    wctx.restore();

    wctx.save();

    wctx.beginPath();
    wctx.arc(cx, cy, radius * 1.003, 0, TAU);
    wctx.strokeStyle = "rgba(116, 207, 255, 0.38)";
    wctx.lineWidth = Math.max(1, size * 0.006);
    wctx.stroke();

    wctx.beginPath();
    wctx.arc(cx, cy, radius * 1.045, 0, TAU);
    wctx.strokeStyle = "rgba(91, 174, 236, 0.14)";
    wctx.lineWidth = Math.max(1, size * 0.01);
    wctx.stroke();

    wctx.restore();
  }

  function composite(time) {
    const canvas = runtime.canvas;
    const ctx = runtime.ctx;
    const w = canvas.width;
    const h = canvas.height;

    if (!w || !h || !runtime.image) return;

    paintBackplate(ctx, w, h, time);
    paintSphere(time);

    const drawSize = Math.min(w, h);
    const dx = (w - drawSize) * 0.5;
    const dy = (h - drawSize) * 0.5;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(runtime.work, dx, dy, drawSize, drawSize);
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const cx = w * 0.5;
    const cy = h * 0.505;
    const radius = drawSize * 0.402;
    const halo = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.42);

    halo.addColorStop(0, "rgba(0,0,0,0)");
    halo.addColorStop(0.38, "rgba(62,154,226,0.11)");
    halo.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.42, 0, TAU);
    ctx.fill();

    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "soft-light";
    ctx.fillStyle = "rgba(255,255,255,0.025)";

    const lines = 22;
    for (let i = 0; i < lines; i += 1) {
      const yy = h * (i / lines);
      ctx.fillRect(0, yy, w, 1);
    }

    ctx.restore();
  }

  function loop(time) {
    if (runtime.disposed) return;

    if (!runtime.lastFrame || time - runtime.lastFrame > 31) {
      runtime.lastFrame = time;
      composite(time);
    }

    runtime.raf = requestAnimationFrame(loop);
  }

  function mount() {
    installStyle();

    const mountEl = getMount();
    mountEl.replaceChildren();

    const canvas = document.createElement("canvas");
    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.contract = CONTRACT;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth G2 advanced procedural hybrid simulation Earth model");

    mountEl.appendChild(canvas);

    runtime.mount = mountEl;
    runtime.canvas = canvas;
    runtime.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    runtime.work = document.createElement("canvas");
    runtime.workCtx = runtime.work.getContext("2d", { alpha: true, willReadFrequently: false });
    runtime.map = makeTexture();

    mountEl.dataset.hearthCanvasContract = CONTRACT;
    mountEl.dataset.hearthCanvasReceipt = RECEIPT;
    mountEl.dataset.hearthRenderOwner = "/assets/hearth/hearth.canvas.js";
    mountEl.dataset.earthPlaceholder = "false";

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthExternalImages = "false";
    document.documentElement.dataset.hearthNasaAsset = "false";
    document.documentElement.dataset.hearthGeneratedImage = "false";
    document.documentElement.dataset.hearthEarthPlaceholder = "false";

    window.HEARTH_CANVAS_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      route: location.pathname,
      renderOwner: "/assets/hearth/hearth.canvas.js",
      mount: "#hearthCanvasMount",
      externalImages: false,
      nasaAsset: false,
      generatedImage: false,
      earthPlaceholder: false,
      status: "mounted"
    });

    runtime.resizeObserver = new ResizeObserver(resize);
    runtime.resizeObserver.observe(mountEl);
    window.addEventListener("resize", resize, { passive: true });

    resize();

    runtime.mounted = true;
    runtime.raf = requestAnimationFrame(loop);
  }

  function dispose() {
    runtime.disposed = true;
    cancelAnimationFrame(runtime.raf);
    window.removeEventListener("resize", resize);

    if (runtime.resizeObserver) runtime.resizeObserver.disconnect();

    const style = document.getElementById("hearth-g2-model-style");
    if (style) style.remove();

    if (runtime.mount) runtime.mount.replaceChildren();

    window.__HEARTH_CANVAS_G2_DISPOSE__ = null;
  }

  window.__HEARTH_CANVAS_G2_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_DISPOSE__ = dispose;
  window.__HEARTH_G2_DISPOSE__ = dispose;

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
