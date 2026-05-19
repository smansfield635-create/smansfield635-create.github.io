/* TARGET FILE: /showroom/globe/audralia/index.js */
/*
  AUDRALIA_ORGANIC_LANDFORM_HYDROLOGY_VISUAL_RENEWAL_TNT_v1
  route=/showroom/globe/audralia/
  purpose=replace one-big-land-glob read with organic landform + hydrology globe
  preserves=#audraliaCanvasMount, boxed containment, touch scope, Audralia spelling, no generated image, no GraphicBox
*/

(function () {
  "use strict";

  const CONTRACT = "AUDRALIA_ORGANIC_LANDFORM_HYDROLOGY_VISUAL_RENEWAL_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const WORLD = "Audralia";

  const mount =
    document.getElementById("audraliaCanvasMount") ||
    document.querySelector("[data-audralia-canvas-mount='true']") ||
    document.querySelector("[data-audralia-globe-mount='true']");

  const stage =
    document.getElementById("audralia-stage") ||
    document.querySelector("[data-audralia-stage='true']") ||
    (mount ? mount.closest(".stage") : null);

  const routeNotice =
    document.getElementById("audraliaRouteLoaderNotice") ||
    document.querySelector("[data-audralia-route-loader-notice='true']");

  const routeStatus =
    document.getElementById("audraliaRouteStatus") ||
    document.querySelector("[data-audralia-route-status='true']");

  if (!mount) {
    if (stage) stage.setAttribute("data-loader-state", "fallback");
    if (routeNotice) routeNotice.textContent = "Audralia mount missing";
    if (routeStatus) routeStatus.textContent = "Organic globe renewal held";
    return;
  }

  window.DGB_AUDRALIA_ORGANIC_LANDFORM_HYDROLOGY_VISUAL_RENEWAL = CONTRACT;
  window.DGB_AUDRALIA_CANONICAL_SPELLING = "A_U_D_R_A_L_I_A";
  window.DGB_AUDRALIA_TOUCH_SCOPE = "box-only";
  window.DGB_AUDRALIA_GENERATED_IMAGE = false;
  window.DGB_AUDRALIA_GRAPHIC_BOX = false;
  window.DGB_AUDRALIA_VISUAL_PASS_CLAIMED = false;

  mount.textContent = "";
  mount.setAttribute("data-audralia-organic-landform-hydrology", "true");
  mount.setAttribute("data-audralia-contract", CONTRACT);
  mount.setAttribute("data-audralia-world", WORLD);
  mount.setAttribute("data-audralia-touch-scope", "box-only");
  mount.setAttribute("data-generated-image", "false");
  mount.setAttribute("data-graphic-box", "false");
  mount.setAttribute("data-visual-pass-claimed", "false");

  if (stage) {
    stage.setAttribute("data-loader-state", "mounted");
    stage.setAttribute("data-audralia-visual-renewal", CONTRACT);
    stage.setAttribute("data-landform-problem-corrected", "one-big-glob-targeted");
    stage.setAttribute("data-touch-scope", "box-only");
  }

  if (routeNotice) routeNotice.textContent = "Organic landform hydrology active";
  if (routeStatus) routeStatus.textContent = "Audralia globe contained";

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-label", "Audralia organic landform and hydrology globe");
  canvas.setAttribute("data-audralia-visible-canvas", "true");
  canvas.setAttribute("data-audralia-globe", "organic-landform-hydrology");
  canvas.setAttribute("data-audralia-contract", CONTRACT);
  canvas.setAttribute("data-generated-image", "false");
  canvas.setAttribute("data-graphic-box", "false");
  canvas.setAttribute("data-visual-pass-claimed", "false");

  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block",
    touchAction: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    cursor: "grab"
  });

  mount.appendChild(canvas);

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: true
  });

  const TEX_W = 720;
  const TEX_H = 360;
  const texture = buildPlanetTexture(TEX_W, TEX_H);

  const sphereBuffer = document.createElement("canvas");
  const sphereCtx = sphereBuffer.getContext("2d", {
    alpha: true,
    willReadFrequently: true
  });

  const state = {
    width: 1,
    height: 1,
    dpr: 1,
    sphereSize: 420,
    radius: 180,
    cx: 0,
    cy: 0,
    rotation: -0.88,
    targetRotation: -0.88,
    tilt: -0.11,
    targetTilt: -0.11,
    pointerActive: false,
    startX: 0,
    startY: 0,
    startRotation: -0.88,
    startTilt: -0.11,
    lastTime: performance.now(),
    lastRenderTime: 0,
    visible: true,
    reducedMotion: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  function hash2(x, y) {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrapLon(x) {
    let value = x;
    while (value < -Math.PI) value += Math.PI * 2;
    while (value > Math.PI) value -= Math.PI * 2;
    return value;
  }

  function noise2(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    const a = hash2(ix, iy);
    const b = hash2(ix + 1, iy);
    const c = hash2(ix, iy + 1);
    const d = hash2(ix + 1, iy + 1);

    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }

  function fbm(x, y) {
    let value = 0;
    let amp = 0.5;
    let freq = 1;
    for (let i = 0; i < 5; i += 1) {
      value += amp * noise2(x * freq, y * freq);
      freq *= 2.05;
      amp *= 0.5;
    }
    return value;
  }

  function ellipseField(lon, lat, item) {
    const dlon = wrapLon(lon - item.lon);
    const dlat = lat - item.lat;
    const q = (dlon * dlon) / (item.rx * item.rx) + (dlat * dlat) / (item.ry * item.ry);
    return 1 - q;
  }

  function mixColor(a, b, t) {
    const k = clamp(t, 0, 1);
    return [
      lerp(a[0], b[0], k),
      lerp(a[1], b[1], k),
      lerp(a[2], b[2], k)
    ];
  }

  function buildPlanetTexture(w, h) {
    const data = new Uint8ClampedArray(w * h * 4);

    const continents = [
      { lon: -2.42, lat: -0.18, rx: 0.54, ry: 0.36, strength: 1.08 },
      { lon: -1.72, lat: 0.32, rx: 0.46, ry: 0.30, strength: 0.98 },
      { lon: -0.86, lat: -0.08, rx: 0.60, ry: 0.34, strength: 1.04 },
      { lon: -0.04, lat: 0.24, rx: 0.42, ry: 0.27, strength: 0.90 },
      { lon: 0.72, lat: -0.30, rx: 0.50, ry: 0.31, strength: 0.98 },
      { lon: 1.42, lat: 0.18, rx: 0.47, ry: 0.34, strength: 0.94 },
      { lon: 2.34, lat: -0.06, rx: 0.54, ry: 0.30, strength: 1.00 },
      { lon: 2.78, lat: 0.44, rx: 0.34, ry: 0.22, strength: 0.72 }
    ];

    const waterCuts = [
      { lon: -2.08, lat: 0.06, rx: 0.22, ry: 0.42, strength: 0.92 },
      { lon: -1.20, lat: 0.16, rx: 0.18, ry: 0.34, strength: 0.82 },
      { lon: -0.48, lat: -0.24, rx: 0.24, ry: 0.28, strength: 0.88 },
      { lon: 0.34, lat: 0.04, rx: 0.20, ry: 0.38, strength: 0.82 },
      { lon: 1.06, lat: 0.34, rx: 0.22, ry: 0.28, strength: 0.74 },
      { lon: 1.86, lat: -0.20, rx: 0.19, ry: 0.38, strength: 0.90 },
      { lon: 2.58, lat: 0.18, rx: 0.21, ry: 0.28, strength: 0.78 }
    ];

    const inlandWaters = [
      { lon: -1.60, lat: 0.10, rx: 0.075, ry: 0.045, strength: 1 },
      { lon: -0.72, lat: 0.18, rx: 0.090, ry: 0.052, strength: 1 },
      { lon: 0.84, lat: -0.08, rx: 0.080, ry: 0.050, strength: 1 },
      { lon: 1.62, lat: 0.23, rx: 0.070, ry: 0.042, strength: 1 },
      { lon: 2.28, lat: -0.18, rx: 0.090, ry: 0.050, strength: 1 }
    ];

    const islands = [
      { lon: -2.88, lat: -0.52, rx: 0.16, ry: 0.09, strength: 0.82 },
      { lon: -2.70, lat: -0.36, rx: 0.10, ry: 0.06, strength: 0.74 },
      { lon: -1.02, lat: -0.48, rx: 0.15, ry: 0.08, strength: 0.78 },
      { lon: -0.20, lat: -0.50, rx: 0.12, ry: 0.07, strength: 0.70 },
      { lon: 0.28, lat: 0.54, rx: 0.13, ry: 0.07, strength: 0.66 },
      { lon: 1.12, lat: -0.54, rx: 0.16, ry: 0.08, strength: 0.80 },
      { lon: 2.02, lat: 0.52, rx: 0.14, ry: 0.08, strength: 0.74 },
      { lon: 2.88, lat: -0.42, rx: 0.18, ry: 0.08, strength: 0.82 }
    ];

    for (let y = 0; y < h; y += 1) {
      const v = y / (h - 1);
      const lat = (0.5 - v) * Math.PI;

      for (let x = 0; x < w; x += 1) {
        const u = x / (w - 1);
        const lon = u * Math.PI * 2 - Math.PI;

        const warpA = fbm(lon * 1.2 + 9.7, lat * 1.5 - 4.1) - 0.5;
        const warpB = fbm(lon * 2.4 - 3.2, lat * 2.2 + 8.6) - 0.5;
        const wlon = lon + warpA * 0.22 + Math.sin(lat * 3.0) * 0.05;
        const wlat = lat + warpB * 0.12;

        let landScore = -0.55;

        for (const c of continents) {
          const e = ellipseField(wlon, wlat, c);
          if (e > -0.55) {
            const coastNoise =
              (fbm(wlon * 3.7 + c.lon * 2.0, wlat * 4.3 + c.lat * 2.0) - 0.5) * 0.42 +
              (fbm(wlon * 8.4 - c.lon, wlat * 7.2 + c.lat) - 0.5) * 0.15;
            landScore = Math.max(landScore, e * c.strength + coastNoise);
          }
        }

        for (const island of islands) {
          const e = ellipseField(wlon, wlat, island);
          if (e > -0.3) {
            const islandNoise = (fbm(wlon * 9.0, wlat * 9.0) - 0.5) * 0.28;
            landScore = Math.max(landScore, e * island.strength + islandNoise - 0.05);
          }
        }

        let cutScore = 0;
        for (const cut of waterCuts) {
          const e = ellipseField(wlon, wlat, cut);
          if (e > 0) {
            const edgeSoft = smoothstep(0.0, 0.95, e);
            cutScore = Math.max(cutScore, edgeSoft * cut.strength);
          }
        }

        const corridor =
          Math.abs(Math.sin(wlon * 3.4 + Math.sin(wlat * 5.6) * 0.9)) < 0.115 &&
          Math.abs(wlat) < 0.62
            ? 0.16
            : 0;

        landScore -= cutScore * 0.94;
        landScore -= corridor * smoothstep(-0.16, 0.36, landScore);

        let inlandWater = false;
        let inlandValue = 0;

        for (const lake of inlandWaters) {
          const e = ellipseField(wlon, wlat, lake);
          if (e > 0.15 && landScore > 0.04) {
            inlandWater = true;
            inlandValue = Math.max(inlandValue, e);
          }
        }

        const latitudeIce = smoothstep(1.17, 1.48, Math.abs(lat));
        const shelfBand = smoothstep(-0.30, 0.03, landScore);
        const land = landScore > 0.025 && !inlandWater;

        const ridge =
          fbm(wlon * 9.2 + 2.0, wlat * 4.0 - 1.0) * 0.55 +
          fbm(wlon * 18.0 - 8.0, wlat * 11.0 + 5.0) * 0.24;

        const drainage =
          1 -
          smoothstep(
            0.018,
            0.090,
            Math.abs(Math.sin(wlon * 5.8 + wlat * 3.4 + fbm(wlon * 4.2, wlat * 4.2) * 1.6))
          );

        const px = (y * w + x) * 4;
        let r;
        let g;
        let b;

        if (land) {
          const lowland = smoothstep(0.02, 0.22, landScore);
          const highland = smoothstep(0.26, 0.72, landScore + ridge * 0.16);
          const wet = clamp(drainage * 0.42 + (1 - lowland) * 0.28 + (fbm(wlon * 5.0, wlat * 5.0) - 0.5) * 0.18, 0, 1);
          const dry = smoothstep(0.20, 0.70, fbm(wlon * 1.8 - 5.5, wlat * 2.2 + 1.2));

          const plains = [123, 142, 88];
          const lush = [76, 136, 95];
          const upland = [135, 121, 79];
          const ridgeColor = [118, 102, 78];
          const wetland = [70, 128, 102];

          let base = mixColor(plains, lush, wet);
          base = mixColor(base, upland, dry * 0.55);
          base = mixColor(base, ridgeColor, highland * 0.62);
          base = mixColor(base, wetland, drainage * 0.24 * (1 - highland));

          const texturePulse = (fbm(wlon * 24.0, wlat * 18.0) - 0.5) * 18;
          r = base[0] + texturePulse;
          g = base[1] + texturePulse * 0.9;
          b = base[2] + texturePulse * 0.65;

          if (latitudeIce > 0) {
            const ice = [205, 226, 218];
            const mixed = mixColor([r, g, b], ice, latitudeIce * 0.72);
            r = mixed[0];
            g = mixed[1];
            b = mixed[2];
          }
        } else {
          const deep = [4, 24, 62];
          const mid = [11, 76, 112];
          const shelf = [72, 164, 164];
          const turquoise = [142, 204, 174];
          const lake = [36, 120, 132];

          if (inlandWater) {
            const mixed = mixColor(lake, turquoise, smoothstep(0.15, 1, inlandValue) * 0.50);
            r = mixed[0];
            g = mixed[1];
            b = mixed[2];
          } else {
            let water = mixColor(deep, mid, shelfBand * 0.68);
            water = mixColor(water, shelf, shelfBand * 0.42);
            water = mixColor(water, turquoise, smoothstep(-0.08, 0.025, landScore) * 0.58);
            const waveNoise = (fbm(wlon * 18.0, wlat * 12.0) - 0.5) * 9;
            r = water[0] + waveNoise * 0.35;
            g = water[1] + waveNoise * 0.75;
            b = water[2] + waveNoise;
          }

          if (latitudeIce > 0) {
            const iceWater = [180, 216, 218];
            const mixed = mixColor([r, g, b], iceWater, latitudeIce * 0.55);
            r = mixed[0];
            g = mixed[1];
            b = mixed[2];
          }
        }

        const coastLight = !land && !inlandWater ? smoothstep(-0.06, 0.030, landScore) : 0;

        if (coastLight > 0) {
          r = lerp(r, 190, coastLight * 0.28);
          g = lerp(g, 224, coastLight * 0.32);
          b = lerp(b, 190, coastLight * 0.30);
        }

        data[px] = clamp(Math.round(r), 0, 255);
        data[px + 1] = clamp(Math.round(g), 0, 255);
        data[px + 2] = clamp(Math.round(b), 0, 255);
        data[px + 3] = 255;
      }
    }

    return { width: w, height: h, data };
  }

  function sampleTexture(lon, lat) {
    let u = (wrapLon(lon) + Math.PI) / (Math.PI * 2);
    let v = 0.5 - lat / Math.PI;

    u = u - Math.floor(u);
    v = clamp(v, 0, 0.999999);

    const x = Math.floor(u * texture.width);
    const y = Math.floor(v * texture.height);
    const index = (y * texture.width + x) * 4;

    return [
      texture.data[index],
      texture.data[index + 1],
      texture.data[index + 2],
      texture.data[index + 3]
    ];
  }

  function normalize(v) {
    const len = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / len, v[1] / len, v[2] / len];
  }

  function resizeCanvas() {
    const rect = mount.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.65);

    state.width = Math.max(320, Math.floor(rect.width));
    state.height = Math.max(260, Math.floor(rect.height));
    state.dpr = dpr;

    canvas.width = Math.max(1, Math.floor(state.width * dpr));
    canvas.height = Math.max(1, Math.floor(state.height * dpr));
    canvas.style.width = state.width + "px";
    canvas.style.height = state.height + "px";

    state.radius = Math.min(canvas.width, canvas.height) * 0.365;
    state.cx = canvas.width * 0.50;
    state.cy = canvas.height * 0.51;
    state.sphereSize = Math.min(560, Math.max(340, Math.floor(state.radius * 2)));

    sphereBuffer.width = state.sphereSize;
    sphereBuffer.height = state.sphereSize;
  }

  function renderBackground() {
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(w * 0.50, h * 0.45, w * 0.06, w * 0.50, h * 0.52, w * 0.78);
    bg.addColorStop(0, "rgba(24, 52, 70, 0.95)");
    bg.addColorStop(0.38, "rgba(6, 17, 35, 0.98)");
    bg.addColorStop(1, "rgba(1, 4, 13, 1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = 0.55;
    for (let i = 0; i < 70; i += 1) {
      const x = hash2(i + 11, 4) * w;
      const y = hash2(i + 17, 7) * h;
      const r = 0.7 + hash2(i, 9) * 1.6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(210, 248, 230, 0.12)";
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = "rgba(158, 240, 191, 0.22)";
    ctx.lineWidth = Math.max(1, canvas.width * 0.0012);
    for (let i = 0; i < 8; i += 1) {
      const y = h * (0.18 + i * 0.095);
      ctx.beginPath();
      ctx.moveTo(w * 0.08, y);
      ctx.bezierCurveTo(w * 0.28, y - 22, w * 0.66, y + 18, w * 0.92, y - 6);
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderSphere() {
    const size = state.sphereSize;
    const radius = size * 0.5;
    const image = sphereCtx.createImageData(size, size);
    const out = image.data;

    const rotation = state.rotation;
    const tilt = state.tilt;
    const sinTilt = Math.sin(tilt);
    const cosTilt = Math.cos(tilt);
    const light = normalize([-0.45, 0.34, 0.82]);
    const hazeShift = performance.now() * 0.00003;

    for (let y = 0; y < size; y += 1) {
      const ny = (y - radius) / radius;

      for (let x = 0; x < size; x += 1) {
        const nx = (x - radius) / radius;
        const d2 = nx * nx + ny * ny;
        const px = (y * size + x) * 4;

        if (d2 > 1) {
          out[px + 3] = 0;
          continue;
        }

        const z = Math.sqrt(1 - d2);
        const y3 = -ny * cosTilt - z * sinTilt;
        const z3 = -ny * sinTilt + z * cosTilt;
        const x3 = nx;

        const lat = Math.asin(clamp(y3, -1, 1));
        const lon = Math.atan2(x3, z3) + rotation;

        const color = sampleTexture(lon, lat);
        const normal = normalize([x3, y3, z3]);
        const lightDot = clamp(normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2], -1, 1);

        const daylight = 0.28 + Math.max(0, lightDot) * 0.82;
        const night = smoothstep(-0.48, 0.12, lightDot);
        const limb = Math.pow(1 - z, 1.8);
        const rim = Math.pow(1 - z, 3.0);
        const cloudNoise = fbm((lon + hazeShift) * 2.2 + Math.sin(lat * 4.0) * 0.3, lat * 3.0 + hazeShift);
        const cloud = smoothstep(0.64, 0.82, cloudNoise) * smoothstep(-0.95, 0.55, lightDot) * 0.18;

        let r = color[0] * daylight;
        let g = color[1] * daylight;
        let b = color[2] * daylight;

        r = lerp(r * 0.45, r, night);
        g = lerp(g * 0.52, g, night);
        b = lerp(b * 0.70, b, night);

        r = lerp(r, 220, cloud);
        g = lerp(g, 238, cloud);
        b = lerp(b, 232, cloud);

        r = lerp(r, 92, limb * 0.26);
        g = lerp(g, 156, limb * 0.20);
        b = lerp(b, 176, limb * 0.26);

        r = lerp(r, 142, rim * 0.36);
        g = lerp(g, 224, rim * 0.30);
        b = lerp(b, 204, rim * 0.34);

        out[px] = clamp(Math.round(r), 0, 255);
        out[px + 1] = clamp(Math.round(g), 0, 255);
        out[px + 2] = clamp(Math.round(b), 0, 255);
        out[px + 3] = clamp(Math.round(255 * smoothstep(1.005, 0.985, d2)), 0, 255);
      }
    }

    sphereCtx.putImageData(image, 0, 0);
  }

  function drawStageLabels() {
    const w = canvas.width;
    const h = canvas.height;
    const dpr = state.dpr;

    function roundedRect(context, x, y, width, height, radius) {
      const r = Math.min(radius, width / 2, height / 2);
      context.beginPath();
      context.moveTo(x + r, y);
      context.arcTo(x + width, y, x + width, y + height, r);
      context.arcTo(x + width, y + height, x, y + height, r);
      context.arcTo(x, y + height, x, y, r);
      context.arcTo(x, y, x + width, y, r);
      context.closePath();
    }

    function pill(text, x, y, width) {
      const height = 34 * dpr;
      const radius = height / 2;
      ctx.save();
      ctx.fillStyle = "rgba(6, 16, 20, 0.74)";
      ctx.strokeStyle = "rgba(158, 240, 191, 0.28)";
      ctx.lineWidth = 1 * dpr;
      roundedRect(ctx, x, y, width, height, radius);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(205, 255, 228, 0.92)";
      ctx.font = `${Math.max(10, 12 * dpr)}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, x + width / 2, y + height / 2 + 0.5 * dpr);
      ctx.restore();
    }

    pill("ORGANIC LANDFORM ACTIVE", w * 0.50 - 150 * dpr, h * 0.82, 300 * dpr);
    pill("HYDROLOGY SHAPES COAST", w * 0.50 - 160 * dpr, h * 0.89, 320 * dpr);
  }

  function draw() {
    renderBackground();

    const glowR = state.radius * 1.26;
    const glow = ctx.createRadialGradient(state.cx, state.cy, state.radius * 0.48, state.cx, state.cy, glowR);
    glow.addColorStop(0, "rgba(158,240,191,0.02)");
    glow.addColorStop(0.52, "rgba(141,216,255,0.08)");
    glow.addColorStop(0.78, "rgba(158,240,191,0.10)");
    glow.addColorStop(1, "rgba(158,240,191,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, glowR, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = "rgba(158,240,191,0.16)";
    ctx.lineWidth = Math.max(1, canvas.width * 0.002);
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius * 1.025, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    renderSphere();

    const diameter = state.radius * 2;
    ctx.drawImage(sphereBuffer, state.cx - state.radius, state.cy - state.radius, diameter, diameter);

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.23;
    const spec = ctx.createRadialGradient(
      state.cx - state.radius * 0.22,
      state.cy - state.radius * 0.38,
      0,
      state.cx - state.radius * 0.22,
      state.cy - state.radius * 0.38,
      state.radius * 0.74
    );
    spec.addColorStop(0, "rgba(255,255,255,0.60)");
    spec.addColorStop(0.24, "rgba(214,255,235,0.18)");
    spec.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = spec;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "rgba(243,200,111,0.20)";
    ctx.lineWidth = Math.max(1, canvas.width * 0.0015);
    ctx.beginPath();
    ctx.ellipse(state.cx, state.cy, state.radius * 1.08, state.radius * 0.68, -0.08, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    drawStageLabels();
  }

  function pointerDown(event) {
    state.pointerActive = true;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.startRotation = state.targetRotation;
    state.startTilt = state.targetTilt;
    canvas.style.cursor = "grabbing";

    try {
      canvas.setPointerCapture(event.pointerId);
    } catch (error) {}
  }

  function pointerMove(event) {
    if (!state.pointerActive) return;

    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;

    state.targetRotation = state.startRotation + dx * 0.010;
    state.targetTilt = clamp(state.startTilt + dy * 0.004, -0.55, 0.45);
  }

  function pointerUp(event) {
    state.pointerActive = false;
    canvas.style.cursor = "grab";

    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch (error) {}
  }

  function tick(now) {
    const dt = Math.min(64, now - state.lastTime);
    state.lastTime = now;

    if (!state.reducedMotion && !state.pointerActive) {
      state.targetRotation += dt * 0.000035;
    }

    state.rotation += (state.targetRotation - state.rotation) * 0.16;
    state.tilt += (state.targetTilt - state.tilt) * 0.14;

    if (state.visible && now - state.lastRenderTime > 42) {
      draw();
      state.lastRenderTime = now;
    }

    window.requestAnimationFrame(tick);
  }

  function handleResize() {
    resizeCanvas();
    draw();
  }

  canvas.addEventListener("pointerdown", pointerDown, { passive: true });
  canvas.addEventListener("pointermove", pointerMove, { passive: true });
  canvas.addEventListener("pointerup", pointerUp, { passive: true });
  canvas.addEventListener("pointercancel", pointerUp, { passive: true });
  canvas.addEventListener("lostpointercapture", pointerUp, { passive: true });

  window.addEventListener("resize", handleResize, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        state.visible = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);
  }

  const receipt = document.createElement("template");
  receipt.id = "audralia-organic-landform-hydrology-receipt";
  receipt.setAttribute("data-route-receipt", "");
  receipt.innerHTML = `
${CONTRACT}
route=${ROUTE}
world=${WORLD}
canonical_spelling=A_U_D_R_A_L_I_A
target_file=/showroom/globe/audralia/index.js
mount=#audraliaCanvasMount
problem=one_big_land_glob
correction=organic_landform_hydrology_visual_renewal
ocean_dominant=true
organic_coastline_breakup=true
bays_gulfs_peninsulas=true
island_chains=true
inland_water=true
coastal_shelves=true
deep_ocean_contrast=true
terrain_follows_hydrology=true
touch_scope=box_only
box_containment=true
generated_image=false
graphic_box=false
visual_pass_claimed=false
`;
  document.body.appendChild(receipt);

  resizeCanvas();
  draw();
  window.requestAnimationFrame(tick);
})();
