// /assets/hearth/hearth.canvas.js
// HEARTH_G4_LOCAL_SCALE_TIC_TAC_TOE_QUAD_A_TNT_v1
// Full-file replacement.
// Purpose:
// - Raise Hearth independently from G2 to G4 on Hearth's own scale.
// - Preserve Hearth as hybrid simulation Earth, not NASA Earth and not Audralia.
// - Improve atmosphere, ocean depth, land material separation, cloud runtime, rim light, polar behavior, and mobile scroll safety.
// - Tic-Tac-Toe dynamic protocol embedded as receipt state.
// - Quad-A adversarial strike embedded as authority checks.
// - No JPG. No NASA asset. No generated image. No GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G4_LOCAL_SCALE_TIC_TAC_TOE_QUAD_A_TNT_v1";
  const VERSION = "2026-05-08.hearth-g4-local-scale";
  const RECEIPT = "HEARTH_G4_LOCAL_SCALE_RECEIPT";

  const MAP_W = 1024;
  const MAP_H = 512;
  const MIN_RENDER_SIZE = 300;
  const MAX_RENDER_SIZE = 680;
  const TAU = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  const TTT_PROTOCOL = Object.freeze({
    T1: "isolate-hearth",
    T2: "raise-hearth-to-g4",
    T3: "stress-hearth",
    T4: "hold-audralia-independent",
    T5: "hold-earth-independent",
    T6: "reject-cross-bleed",
    T7: "prove-local-scale",
    T8: "defer-scale-merge",
    T9: "return-receipt"
  });

  const QUAD_A_STRIKE = Object.freeze({
    A1_authority: "Hearth render authority remains /assets/hearth/hearth.canvas.js",
    A2_axis: "Hearth keeps atmospheric hybrid-Earth globe axis",
    A3_artifact: "Visible G4 proof must mount only in Hearth mount",
    A4_attack: "Reject Earth placeholder, NASA image, Audralia map, and duplicate lower frame"
  });

  if (typeof window.__HEARTH_CANVAS_G4_DISPOSE__ === "function") {
    try {
      window.__HEARTH_CANVAS_G4_DISPOSE__();
    } catch (_) {}
  }

  if (typeof window.__HEARTH_CANVAS_G2_DISPOSE__ === "function") {
    try {
      window.__HEARTH_CANVAS_G2_DISPOSE__();
    } catch (_) {}
  }

  if (typeof window.__HEARTH_CANVAS_DISPOSE__ === "function") {
    try {
      window.__HEARTH_CANVAS_DISPOSE__();
    } catch (_) {}
  }

  const runtime = {
    mounted: false,
    disposed: false,
    raf: 0,
    lastFrame: 0,
    mount: null,
    canvas: null,
    ctx: null,
    work: null,
    workCtx: null,
    image: null,
    size: 0,
    map: null,
    observer: null,
    frameCount: 0
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => Math.round(lerp(a, b, clamp(t, 0, 1)));

  function smoothstep(a, b, x) {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function normalize3(v) {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
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

  const LIGHT = normalize3([-0.58, -0.34, 0.92]);
  const HALF_LIGHT = normalize3([LIGHT[0], LIGHT[1], LIGHT[2] + 1.24]);

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
      sum += valueNoise(x * freq, y * freq, seed + i * 19.77) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= 2.03;
    }

    return norm ? sum / norm : 0;
  }

  const HEARTH_CONTINENTS = [
    { lon: -112, lat: 44, rx: 44, ry: 24, amp: 1.08 },
    { lon: -88, lat: 18, rx: 22, ry: 17, amp: 0.55 },
    { lon: -62, lat: -18, rx: 27, ry: 39, amp: 0.94 },
    { lon: 22, lat: 6, rx: 31, ry: 36, amp: 0.90 },
    { lon: 76, lat: 48, rx: 70, ry: 30, amp: 1.10 },
    { lon: 105, lat: 24, rx: 44, ry: 25, amp: 0.78 },
    { lon: 137, lat: -25, rx: 23, ry: 17, amp: 0.74 },
    { lon: -42, lat: 74, rx: 18, ry: 10, amp: 0.52 },
    { lon: 8, lat: -82, rx: 180, ry: 12, amp: 0.92 },
    { lon: 44, lat: -49, rx: 19, ry: 10, amp: 0.35 }
  ];

  function continentField(lon, lat) {
    let v = 0;

    for (const c of HEARTH_CONTINENTS) {
      const dx = lonDelta(lon, c.lon) / c.rx;
      const dy = (lat - c.lat) / c.ry;
      const q = 1 - (dx * dx + dy * dy);
      v += c.amp * smoothstep(-0.20, 0.88, q);
    }

    return v;
  }

  function buildHearthMap() {
    const len = MAP_W * MAP_H;

    const r = new Uint8ClampedArray(len);
    const g = new Uint8ClampedArray(len);
    const b = new Uint8ClampedArray(len);
    const land = new Uint8ClampedArray(len);
    const coast = new Uint8ClampedArray(len);
    const cloud = new Uint8ClampedArray(len);
    const height = new Float32Array(len);
    const roughness = new Float32Array(len);
    const oceanDepth = new Float32Array(len);
    const ice = new Float32Array(len);

    for (let y = 0; y < MAP_H; y += 1) {
      const lat = 90 - (y / (MAP_H - 1)) * 180;
      const latAbs = Math.abs(lat);

      for (let x = 0; x < MAP_W; x += 1) {
        const lon = (x / MAP_W) * 360 - 180;
        const nx = x / MAP_W;
        const ny = y / MAP_H;
        const idx = y * MAP_W + x;

        const plate = continentField(lon, lat);
        const broad = (fbm(nx * 7.2, ny * 5.0, 2.1, 6) - 0.5) * 0.27;
        const ridge = (fbm(nx * 24.0 + 7.0, ny * 18.0 - 3.0, 6.4, 5) - 0.5) * 0.16;
        const micro = (fbm(nx * 92.0, ny * 61.0, 9.7, 3) - 0.5) * 0.04;
        const tectonic = (fbm(nx * 15.5 - 2.0, ny * 11.5 + 4.0, 44.4, 4) - 0.5) * 0.09;
        const polarPress = latAbs > 63 ? ((latAbs - 63) / 27) * 0.04 : 0;

        const h = plate + broad + ridge + micro + tectonic + polarPress - 0.43;
        const isLand = h > 0;

        height[idx] = h;
        land[idx] = isLand ? 255 : 0;

        const coastBand = 1 - smoothstep(0.014, 0.142, Math.abs(h));
        coast[idx] = Math.round(coastBand * 255);

        const terrainNoise = fbm(nx * 47 + 11, ny * 36 - 2, 13.9, 5);
        const veinNoise = fbm(nx * 152, ny * 91, 18.4, 3);
        const frostNoise = fbm(nx * 34 - 7, ny * 44 + 6, 62.5, 4);

        const iceLat = smoothstep(62, 84, latAbs);
        const snowHigh = isLand ? smoothstep(0.34, 0.80, h + terrainNoise * 0.20) : 0;
        const glacier = clamp(iceLat * 0.86 + snowHigh * 0.44 + frostNoise * 0.08, 0, 1);
        ice[idx] = glacier;

        roughness[idx] = isLand
          ? clamp(0.28 + terrainNoise * 0.42 + Math.max(0, h) * 0.36, 0, 1)
          : clamp(0.12 + fbm(nx * 31, ny * 18, 77.2, 4) * 0.18, 0, 1);

        if (isLand) {
          const elevation = clamp(h * 1.85, 0, 1);
          const arid =
            smoothstep(8, 31, latAbs) *
            (1 - smoothstep(31, 58, latAbs));
          const wet = fbm(nx * 13.5 - 4.0, ny * 8.4 + 5.0, 22.5, 5);
          const green = clamp((wet - 0.28) * 1.35 * (1 - arid * 0.48), 0, 1);
          const mountain = smoothstep(0.36, 0.82, elevation + ridge * 1.85);
          const mineral = smoothstep(0.55, 0.90, veinNoise);
          const shore = smoothstep(0.0, 0.055, h) * (1 - smoothstep(0.055, 0.20, h));

          let rr = mix(130, 42, green);
          let gg = mix(105, 118, green);
          let bb = mix(60, 67, green);

          rr = mix(rr, 172, arid * 0.45);
          gg = mix(gg, 139, arid * 0.36);
          bb = mix(bb, 88, arid * 0.28);

          rr = mix(rr, 112, mountain * 0.50);
          gg = mix(gg, 108, mountain * 0.48);
          bb = mix(bb, 104, mountain * 0.55);

          rr = mix(rr, 188, mineral * mountain * 0.18);
          gg = mix(gg, 180, mineral * mountain * 0.15);
          bb = mix(bb, 154, mineral * mountain * 0.14);

          rr = mix(rr, 224, glacier * 0.78);
          gg = mix(gg, 230, glacier * 0.78);
          bb = mix(bb, 222, glacier * 0.78);

          rr = mix(rr, 190, shore * 0.35);
          gg = mix(gg, 172, shore * 0.30);
          bb = mix(bb, 122, shore * 0.25);

          const grain = (terrainNoise - 0.5) * 24;

          r[idx] = clamp(rr + grain, 0, 255);
          g[idx] = clamp(gg + grain * 0.86, 0, 255);
          b[idx] = clamp(bb + grain * 0.68, 0, 255);
          oceanDepth[idx] = 0;
        } else {
          const depth = clamp(-h * 2.45, 0, 1);
          const shelf = 1 - smoothstep(0.025, 0.18, -h);
          const current = fbm(nx * 34 + 18, ny * 19 - 7, 31.6, 5);
          const abyss = fbm(nx * 9, ny * 7, 35.0, 6);
          const reef = shelf * smoothstep(0.54, 0.88, fbm(nx * 62, ny * 42, 88.1, 3));

          let rr = mix(12, 0, depth);
          let gg = mix(86, 23, depth);
          let bb = mix(132, 76, depth);

          rr = mix(rr, 34, shelf * 0.72);
          gg = mix(gg, 153, shelf * 0.70);
          bb = mix(bb, 164, shelf * 0.68);

          rr = mix(rr, 3, abyss * depth * 0.40);
          gg = mix(gg, 38, abyss * depth * 0.30);
          bb = mix(bb, 102, abyss * depth * 0.28);

          rr = mix(rr, 72, reef * 0.22);
          gg = mix(gg, 184, reef * 0.32);
          bb = mix(bb, 172, reef * 0.28);

          const flow = (current - 0.5) * 20;

          r[idx] = clamp(rr + flow * 0.22, 0, 255);
          g[idx] = clamp(gg + flow * 0.58, 0, 255);
          b[idx] = clamp(bb + flow, 0, 255);
          oceanDepth[idx] = depth;
        }

        const cloudA = fbm(nx * 15.0 + 3.5, ny * 9.0 - 2.0, 51.1, 6);
        const cloudB = fbm(nx * 42.0 - 9.0, ny * 26.0 + 8.0, 58.3, 4);
        const cloudC = fbm(nx * 90.0 + 2.0, ny * 55.0 - 4.0, 72.7, 3);
        const band =
          0.64 +
          0.12 * Math.sin((lat + 8) * Math.PI / 22) +
          0.07 * Math.sin((lon - 25) * Math.PI / 31);

        const belt = smoothstep(0, 38, 38 - latAbs) * 0.42;
        const cval = smoothstep(band, 0.91, cloudA * 0.68 + cloudB * 0.25 + cloudC * 0.07);
        cloud[idx] = Math.round(clamp(cval + belt * smoothstep(0.70, 0.92, cloudB), 0, 1) * 255);
      }
    }

    return { r, g, b, land, coast, cloud, height, roughness, oceanDepth, ice };
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

    const main = document.getElementById("hearth-main") || document.querySelector("main") || document.body;
    const fallback = document.createElement("section");
    fallback.id = "hearthCanvasMount";
    fallback.dataset.hearthMount = "";
    fallback.dataset.hearthFallbackMount = "true";
    fallback.dataset.contract = CONTRACT;
    fallback.style.position = "relative";
    fallback.style.width = "100%";
    fallback.style.aspectRatio = "1 / 1";
    fallback.style.minHeight = "300px";
    fallback.style.overflow = "hidden";
    main.appendChild(fallback);
    return fallback;
  }

  function installStyle() {
    const prior = document.getElementById("hearth-g4-local-scale-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-g4-local-scale-style";
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

      .hearth-g4-scale-chip {
        position: absolute;
        left: 14px;
        bottom: 12px;
        z-index: 4;
        padding: 6px 8px;
        border-radius: 999px;
        border: 1px solid rgba(135, 187, 221, 0.18);
        background: rgba(4, 14, 25, 0.42);
        color: rgba(214, 232, 244, 0.72);
        font: 800 10px/1.1 ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        pointer-events: none;
        user-select: none;
      }

      @media (max-width: 520px) {
        .hearth-g4-scale-chip {
          display: none;
        }
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
    document.body.style.overscrollBehaviorY = "auto";
    document.body.style.webkitOverflowScrolling = "touch";

    document.body.dataset.hearthScrollUnlocked = "true";
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

  function paintBackplate(ctx, w, h, time) {
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(w * 0.50, h * 0.45, w * 0.04, w * 0.50, h * 0.50, w * 0.70);
    bg.addColorStop(0, "rgba(42, 85, 116, 0.36)");
    bg.addColorStop(0.50, "rgba(12, 30, 52, 0.78)");
    bg.addColorStop(1, "rgba(2, 7, 15, 1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.50;
    const cy = h * 0.50;
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.0011);

    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, w * (0.392 + i * 0.031), 0, TAU);
      ctx.strokeStyle = `rgba(102, 174, 225, ${0.095 - i * 0.017 + pulse * 0.012})`;
      ctx.lineWidth = Math.max(1, w * (0.006 - i * 0.0008));
      ctx.stroke();
    }

    const starCount = 34;
    ctx.save();
    ctx.globalAlpha = 0.52;
    for (let i = 0; i < starCount; i += 1) {
      const sx = hash2(i, 3, 91) * w;
      const sy = hash2(i, 7, 92) * h;
      const sr = 0.6 + hash2(i, 11, 93) * 1.4;
      const tw = 0.35 + 0.35 * Math.sin(time * 0.0015 + i);
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, TAU);
      ctx.fillStyle = `rgba(210,230,255,${0.12 + tw * 0.18})`;
      ctx.fill();
    }
    ctx.restore();
  }

  function paintSphere(time) {
    const size = runtime.size;
    const image = runtime.image;
    const map = runtime.map;

    if (!size || !image || !map) return;

    const data = image.data;
    data.fill(0);

    const cx = size * 0.5;
    const cy = size * 0.505;
    const radius = size * 0.402;
    const spin = time * 0.000052;
    const cloudShift = (time * 0.000006) % 1;
    const currentShift = (time * 0.000003) % 1;
    const tilt = -0.10;

    const cosA = Math.cos(spin);
    const sinA = Math.sin(spin);
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

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

        let nx = sx;
        let ny = -sy;
        let nz = z;

        const ty = ny * cosT - nz * sinT;
        const tz = ny * sinT + nz * cosT;
        ny = ty;
        nz = tz;

        const rx = nx * cosA + nz * sinA;
        const rz = -nx * sinA + nz * cosA;

        const lat = Math.asin(clamp(ny, -1, 1));
        const lon = Math.atan2(rx, rz);

        const idx = sampleIndex(lon, lat, 0);
        const cloudIdx = sampleIndex(lon, lat, cloudShift);
        const currentIdx = sampleIndex(lon, lat, currentShift);

        const isLand = map.land[idx] > 0;
        const coast = map.coast[idx] / 255;
        const cloud = map.cloud[cloudIdx] / 255;
        const h = map.height[idx];
        const rough = map.roughness[idx];
        const depth = map.oceanDepth[idx];
        const ice = map.ice[idx];

        let rr = map.r[idx];
        let gg = map.g[idx];
        let bb = map.b[idx];

        const light = clamp(nx * LIGHT[0] + ny * LIGHT[1] + z * LIGHT[2], 0, 1);
        const softLight = 0.34 + light * 0.74;
        const limb = Math.pow(1 - z, 1.70);

        if (!isLand) {
          const movingCurrent = fbm(
            ((lon + Math.PI) / TAU) * 38 + currentShift * 40,
            ((HALF_PI - lat) / Math.PI) * 22,
            121.4,
            3
          );

          const currentVeil = smoothstep(0.58, 0.88, movingCurrent) * (1 - depth * 0.55);
          rr = mix(rr, 45, currentVeil * 0.16);
          gg = mix(gg, 145, currentVeil * 0.25);
          bb = mix(bb, 190, currentVeil * 0.24);

          if (coast > 0.05) {
            const shelf = Math.pow(coast, 1.12);
            rr = mix(rr, 42, shelf * 0.30);
            gg = mix(gg, 174, shelf * 0.40);
            bb = mix(bb, 186, shelf * 0.36);
          }

          const specDot = clamp(nx * HALF_LIGHT[0] + ny * HALF_LIGHT[1] + z * HALF_LIGHT[2], 0, 1);
          const specPower = lerp(95, 52, depth);
          const spec = Math.pow(specDot, specPower) * clamp(light + 0.12, 0, 1) * (0.72 - depth * 0.25);
          rr = mix(rr, 214, spec * 0.42);
          gg = mix(gg, 234, spec * 0.38);
          bb = mix(bb, 252, spec * 0.35);
        }

        if (isLand) {
          if (coast > 0.05) {
            rr = mix(rr, 160, coast * 0.16);
            gg = mix(gg, 148, coast * 0.14);
            bb = mix(bb, 112, coast * 0.12);
          }

          const relief = clamp((h * 0.80 + rough * 0.32) * light, 0, 1);
          rr = mix(rr, rr + 16, relief * 0.12);
          gg = mix(gg, gg + 14, relief * 0.10);
          bb = mix(bb, bb + 10, relief * 0.08);

          if (ice > 0.20) {
            const iceGlow = smoothstep(0.2, 0.9, ice) * (0.25 + light * 0.35);
            rr = mix(rr, 238, iceGlow * 0.22);
            gg = mix(gg, 244, iceGlow * 0.22);
            bb = mix(bb, 238, iceGlow * 0.20);
          }
        }

        const cloudAlpha =
          smoothstep(0.24, 0.92, cloud) *
          (0.36 + 0.22 * light) *
          (1 - limb * 0.44);

        if (cloudAlpha > 0.01) {
          const cloudTone = isLand && h > 0.45 ? 226 : 238;
          rr = mix(rr, cloudTone, cloudAlpha);
          gg = mix(gg, cloudTone + 4, cloudAlpha);
          bb = mix(bb, 246, cloudAlpha);
        }

        rr *= softLight;
        gg *= softLight;
        bb *= softLight;

        rr = mix(rr, 22, limb * 0.30);
        gg = mix(gg, 88, limb * 0.31);
        bb = mix(bb, 145, limb * 0.43);

        const atmosphere = Math.pow(limb, 2.35);
        rr = mix(rr, 40, atmosphere * 0.38);
        gg = mix(gg, 158, atmosphere * 0.50);
        bb = mix(bb, 226, atmosphere * 0.58);

        const terminator = smoothstep(0.0, 0.36, light);
        rr *= 0.70 + terminator * 0.36;
        gg *= 0.70 + terminator * 0.36;
        bb *= 0.74 + terminator * 0.32;

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
      cx - radius * 0.22,
      cy - radius * 0.38,
      radius * 0.05,
      cx,
      cy,
      radius * 0.62
    );

    gx.addColorStop(0, "rgba(255,255,255,0.24)");
    gx.addColorStop(0.25, "rgba(142,205,250,0.08)");
    gx.addColorStop(1, "rgba(0,0,0,0)");

    wctx.fillStyle = gx;
    wctx.beginPath();
    wctx.arc(cx, cy, radius, 0, TAU);
    wctx.fill();
    wctx.restore();

    wctx.save();

    wctx.beginPath();
    wctx.arc(cx, cy, radius * 1.003, 0, TAU);
    wctx.strokeStyle = "rgba(116, 207, 255, 0.42)";
    wctx.lineWidth = Math.max(1, size * 0.006);
    wctx.stroke();

    wctx.beginPath();
    wctx.arc(cx, cy, radius * 1.045, 0, TAU);
    wctx.strokeStyle = "rgba(91, 174, 236, 0.16)";
    wctx.lineWidth = Math.max(1, size * 0.010);
    wctx.stroke();

    wctx.beginPath();
    wctx.arc(cx, cy, radius * 1.088, 0, TAU);
    wctx.strokeStyle = "rgba(74, 152, 220, 0.08)";
    wctx.lineWidth = Math.max(1, size * 0.012);
    wctx.stroke();

    wctx.restore();
  }

  function composite(time) {
    const canvas = runtime.canvas;
    const ctx = runtime.ctx;

    if (!canvas || !ctx || !runtime.image) return;

    const w = canvas.width;
    const h = canvas.height;

    if (!w || !h) return;

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

    const cx = w * 0.5;
    const cy = h * 0.505;
    const radius = drawSize * 0.402;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const halo = ctx.createRadialGradient(cx, cy, radius * 0.90, cx, cy, radius * 1.46);
    halo.addColorStop(0, "rgba(0,0,0,0)");
    halo.addColorStop(0.38, "rgba(62,154,226,0.12)");
    halo.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.46, 0, TAU);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "soft-light";
    ctx.fillStyle = "rgba(255,255,255,0.022)";
    for (let i = 0; i < 24; i += 1) {
      const yy = h * (i / 24);
      ctx.fillRect(0, yy, w, 1);
    }
    ctx.restore();
  }

  function loop(time) {
    if (runtime.disposed) return;

    if (!runtime.lastFrame || time - runtime.lastFrame > 30) {
      runtime.lastFrame = time;
      runtime.frameCount += 1;
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
      generation: "G4-local-scale",
      scaleMergeStatus: "deferred",
      ticTacToeProtocol: TTT_PROTOCOL,
      quadAStrike: QUAD_A_STRIKE,
      externalImages: false,
      nasaAsset: false,
      generatedImage: false,
      graphicBox: false,
      earthPlaceholder: false,
      audraliaMap: false,
      status
    });
  }

  function mount() {
    installStyle();
    unlockScroll();

    const mountEl = getMount();
    mountEl.replaceChildren();

    const canvas = document.createElement("canvas");
    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.contract = CONTRACT;
    canvas.dataset.generation = "G4";
    canvas.dataset.localScale = "hearth";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth G4 local scale hybrid simulation Earth globe");

    const chip = document.createElement("div");
    chip.className = "hearth-g4-scale-chip";
    chip.textContent = "Hearth G4 · Local Scale";

    mountEl.append(canvas, chip);

    runtime.mount = mountEl;
    runtime.canvas = canvas;
    runtime.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    runtime.work = document.createElement("canvas");
    runtime.workCtx = runtime.work.getContext("2d", { alpha: true, willReadFrequently: false });
    runtime.map = buildHearthMap();

    mountEl.dataset.hearthCanvasContract = CONTRACT;
    mountEl.dataset.hearthCanvasReceipt = RECEIPT;
    mountEl.dataset.hearthRenderOwner = "/assets/hearth/hearth.canvas.js";
    mountEl.dataset.hearthGeneration = "G4";
    mountEl.dataset.hearthLocalScale = "true";
    mountEl.dataset.scaleMergeStatus = "deferred";
    mountEl.dataset.earthPlaceholder = "false";
    mountEl.dataset.audraliaMap = "false";

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthGeneration = "G4";
    document.documentElement.dataset.hearthLocalScale = "true";
    document.documentElement.dataset.hearthScaleMergeStatus = "deferred";
    document.documentElement.dataset.hearthExternalImages = "false";
    document.documentElement.dataset.hearthNasaAsset = "false";
    document.documentElement.dataset.hearthGeneratedImage = "false";
    document.documentElement.dataset.hearthGraphicBox = "false";
    document.documentElement.dataset.hearthEarthPlaceholder = "false";

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

    const style = document.getElementById("hearth-g4-local-scale-style");
    if (style) style.remove();

    if (runtime.mount) runtime.mount.replaceChildren();

    window.__HEARTH_CANVAS_G4_DISPOSE__ = null;
    exposeReceipt("disposed");
  }

  window.__HEARTH_CANVAS_G4_DISPOSE__ = dispose;
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
