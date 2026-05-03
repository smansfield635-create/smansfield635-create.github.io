/* /assets/showroom.globe.render.js
   SHOWROOM_GLOBE_RENDER_FILE_EXTRACTION_RENEWAL_TNT_v1

   ROLE:
   Render authority only.

   OWNS:
   Earth/Sun/Moon drawing.
   Axis-globe projection.
   Procedural satellite-style definition.

   DOES_NOT_OWN:
   Route copy.
   Labels.
   Buttons.
   Motion controls.
   Mount selection.
   Gauges.
*/

(function bindShowroomGlobeRender(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_RENDER_FILE_EXTRACTION_RENEWAL_TNT_v1";
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  const BODY_SET = new Set(["earth", "sun", "moon"]);

  const earthLand = [
    [[-168, 70], [-138, 72], [-105, 58], [-84, 50], [-70, 30], [-91, 15], [-112, 20], [-126, 32], [-151, 52]],
    [[-81, 12], [-62, 8], [-44, -11], [-48, -34], [-66, -55], [-76, -35], [-82, -8]],
    [[-54, 82], [-22, 74], [-36, 61], [-62, 68]],
    [[-10, 68], [32, 71], [82, 61], [136, 55], [151, 38], [117, 18], [76, 20], [45, 6], [18, 30], [-10, 36]],
    [[-18, 35], [16, 37], [35, 14], [31, -34], [11, -36], [-12, -6]],
    [[112, -11], [153, -24], [145, -43], [114, -36]],
    [[-180, -70], [-120, -76], [-60, -72], [0, -78], [60, -72], [120, -76], [180, -70], [180, -90], [-180, -90]]
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizeBody(body) {
    body = String(body || "earth").toLowerCase();
    return BODY_SET.has(body) ? body : "earth";
  }

  function rand(seed) {
    const x = Math.sin(seed * 12.9898) * 43758.5453123;
    return x - Math.floor(x);
  }

  function noise2(x, y, seed) {
    const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453123;
    return n - Math.floor(n);
  }

  function smoothNoise(x, y, seed) {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const xf = x - x0;
    const yf = y - y0;

    const a = noise2(x0, y0, seed);
    const b = noise2(x0 + 1, y0, seed);
    const c = noise2(x0, y0 + 1, seed);
    const d = noise2(x0 + 1, y0 + 1, seed);

    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);

    return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
  }

  function octaveNoise(x, y, seed) {
    let total = 0;
    let amp = 1;
    let freq = 1;
    let norm = 0;

    for (let i = 0; i < 5; i += 1) {
      total += smoothNoise(x * freq, y * freq, seed + i * 17) * amp;
      norm += amp;
      amp *= 0.5;
      freq *= 2;
    }

    return total / norm;
  }

  function makeCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function lonToX(lon, width) {
    return ((lon + 180) / 360) * width;
  }

  function latToY(lat, height) {
    return ((90 - lat) / 180) * height;
  }

  function drawLonLatPolygon(ctx, points, width, height, fill, stroke) {
    ctx.beginPath();

    points.forEach(([lon, lat], index) => {
      const x = lonToX(lon, width);
      const y = latToY(lat, height);

      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = Math.max(1, width * 0.0012);
      ctx.stroke();
    }
  }

  function buildEarthMap() {
    const width = 2048;
    const height = 1024;
    const canvas = makeCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const ocean = ctx.createLinearGradient(0, 0, width, height);
    ocean.addColorStop(0, "#052a68");
    ocean.addColorStop(0.32, "#0b78b4");
    ocean.addColorStop(0.62, "#063f91");
    ocean.addColorStop(1, "#011438");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 1100; i += 1) {
      const x = rand(i + 10) * width;
      const y = rand(i + 20) * height;
      const radius = 2 + rand(i + 30) * 18;
      const alpha = 0.025 + rand(i + 40) * 0.075;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TAU);
      ctx.fillStyle = `rgba(130, 220, 255, ${alpha})`;
      ctx.fill();
    }

    earthLand.forEach((poly, index) => {
      const fill =
        index === 2 || index === 6
          ? "rgba(235, 247, 248, 0.95)"
          : index === 3 || index === 4 || index === 5
            ? "rgba(176, 137, 70, 0.96)"
            : "rgba(54, 132, 72, 0.96)";

      drawLonLatPolygon(ctx, poly, width, height, fill, "rgba(255, 255, 220, 0.18)");
    });

    ctx.globalCompositeOperation = "source-atop";

    for (let i = 0; i < 1400; i += 1) {
      const x = rand(i + 300) * width;
      const y = rand(i + 400) * height;
      const n = octaveNoise(x / 90, y / 90, 12);

      if (n < 0.48) continue;

      ctx.beginPath();
      ctx.ellipse(x, y, 12 + n * 35, 5 + n * 15, rand(i + 500) * TAU, 0, TAU);
      ctx.fillStyle = `rgba(34, 82, 41, ${0.08 + n * 0.13})`;
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";

    for (let i = 0; i < 640; i += 1) {
      const x = rand(i + 700) * width;
      const y = rand(i + 800) * height;
      const n = octaveNoise(x / 120, y / 60, 55);

      if (n < 0.54) continue;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rand(i + 900) - 0.5) * 0.8);
      ctx.beginPath();
      ctx.ellipse(0, 0, 45 + n * 130, 8 + n * 18, 0, 0, TAU);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.10 + n * 0.2})`;
      ctx.fill();
      ctx.restore();
    }

    for (let band = 0; band < 5; band += 1) {
      const y = height * (0.24 + band * 0.13);

      ctx.beginPath();
      for (let x = 0; x <= width; x += 18) {
        const wave = Math.sin(x * 0.012 + band) * 20 + Math.sin(x * 0.027 + band * 2) * 8;
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }

      ctx.strokeStyle = "rgba(255, 255, 255, 0.17)";
      ctx.lineWidth = 7 + band * 1.4;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    return canvas;
  }

  function buildSunMap() {
    const width = 1536;
    const height = 768;
    const canvas = makeCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const base = ctx.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, "#8f2408");
    base.addColorStop(0.24, "#e45b18");
    base.addColorStop(0.55, "#ff9e28");
    base.addColorStop(0.82, "#d44612");
    base.addColorStop(1, "#5f1406");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 1900; i += 1) {
      const x = rand(i + 1200) * width;
      const y = rand(i + 1300) * height;
      const n = octaveNoise(x / 70, y / 70, 91);
      const radius = 4 + n * 24;
      const alpha = 0.08 + n * 0.22;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rand(i + 1400) * TAU);
      ctx.scale(2.4 + rand(i + 1500) * 2.2, 0.75);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, TAU);
      ctx.fillStyle = n > 0.6
        ? `rgba(255, 235, 112, ${alpha})`
        : `rgba(255, 123, 26, ${alpha * 0.72})`;
      ctx.fill();
      ctx.restore();
    }

    for (let i = 0; i < 22; i += 1) {
      const x = rand(i + 1700) * width;
      const y = rand(i + 1800) * height;
      const r = 45 + rand(i + 1900) * 145;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, r);

      glow.addColorStop(0, "rgba(255, 248, 180, 0.34)");
      glow.addColorStop(0.5, "rgba(255, 169, 45, 0.12)");
      glow.addColorStop(1, "rgba(255, 80, 18, 0)");

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }

    for (let i = 0; i < 11; i += 1) {
      const y = height * (0.1 + i * 0.085);

      ctx.beginPath();
      for (let x = 0; x <= width; x += 20) {
        const wave = Math.sin(x * 0.011 + i) * 25 + Math.sin(x * 0.028 + i * 2) * 10;
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }

      ctx.strokeStyle = "rgba(255, 226, 92, 0.13)";
      ctx.lineWidth = 6;
      ctx.stroke();
    }

    return canvas;
  }

  function buildMoonMap() {
    const width = 2048;
    const height = 1024;
    const canvas = makeCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const base = ctx.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, "#9b9f9a");
    base.addColorStop(0.45, "#d3d2c8");
    base.addColorStop(1, "#646b70");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const n = octaveNoise(x / 80, y / 80, 203);
        const v = Math.floor(70 + n * 90);
        ctx.fillStyle = `rgba(${v}, ${v}, ${v}, 0.16)`;
        ctx.fillRect(x, y, 4, 4);
      }
    }

    const basins = [
      [0.24, 0.28, 0.16, 0.09],
      [0.52, 0.32, 0.13, 0.08],
      [0.42, 0.52, 0.18, 0.1],
      [0.68, 0.58, 0.12, 0.07],
      [0.22, 0.68, 0.11, 0.07]
    ];

    basins.forEach(([bx, by, rx, ry]) => {
      ctx.save();
      ctx.translate(bx * width, by * height);
      ctx.scale(rx * width, ry * height);
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, TAU);
      ctx.fillStyle = "rgba(58, 63, 65, 0.28)";
      ctx.fill();
      ctx.restore();
    });

    for (let i = 0; i < 440; i += 1) {
      const x = rand(i + 2200) * width;
      const y = rand(i + 2300) * height;
      const r = 2 + Math.pow(rand(i + 2400), 2.15) * 36;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = "rgba(38, 40, 42, 0.13)";
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 245, 0.22)";
      ctx.lineWidth = Math.max(1, r * 0.12);
      ctx.stroke();

      if (r > 14) {
        for (let ray = 0; ray < 8; ray += 1) {
          const angle = (ray / 8) * TAU + rand(i + ray) * 0.28;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + Math.cos(angle) * r * (2.5 + rand(i + ray + 80) * 3),
            y + Math.sin(angle) * r * (2.5 + rand(i + ray + 90) * 3)
          );
          ctx.strokeStyle = "rgba(255, 255, 245, 0.08)";
          ctx.lineWidth = Math.max(1, r * 0.05);
          ctx.stroke();
        }
      }
    }

    return canvas;
  }

  const maps = {
    earth: null,
    sun: null,
    moon: null
  };

  function getMap(body) {
    body = normalizeBody(body);

    if (!maps.earth) maps.earth = buildEarthMap();
    if (!maps.sun) maps.sun = buildSunMap();
    if (!maps.moon) maps.moon = buildMoonMap();

    return maps[body];
  }

  function clipSphere(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.closePath();
    ctx.clip();
  }

  function bodyTilt(body) {
    if (body === "sun") return -7.25;
    if (body === "moon") return -6.68;
    return -23.5;
  }

  function drawProjectedMap(ctx, map, cx, cy, r, longitude, body) {
    const naturalW = map.width;
    const naturalH = map.height;
    const sliceCount = Math.max(420, Math.floor(r * 2.1));
    const tilt = bodyTilt(body) * DEG;

    ctx.save();
    clipSphere(ctx, cx, cy, r);

    ctx.translate(cx, cy);
    ctx.rotate(tilt);
    ctx.translate(-cx, -cy);

    for (let i = 0; i < sliceCount; i += 1) {
      const nx1 = -1 + (2 * i) / sliceCount;
      const nx2 = -1 + (2 * (i + 1)) / sliceCount;
      const nx = (nx1 + nx2) / 2;
      const visibleScale = Math.sqrt(Math.max(0, 1 - nx * nx));

      if (visibleScale <= 0.001) continue;

      const meridian = Math.asin(clamp(nx, -1, 1));
      let u = 0.5 + meridian / Math.PI + longitude;
      u = ((u % 1) + 1) % 1;

      const sx = Math.floor(u * naturalW);
      const sw = Math.max(1, Math.ceil(naturalW / sliceCount) + 1);
      const destX = cx + nx1 * r;
      const destW = Math.ceil((nx2 - nx1) * r) + 2;
      const destH = 2 * r * visibleScale;
      const destY = cy - destH / 2;

      ctx.drawImage(
        map,
        sx,
        0,
        Math.min(sw, naturalW - sx),
        naturalH,
        destX,
        destY,
        destW,
        destH
      );
    }

    ctx.restore();
    drawBodyOptics(ctx, cx, cy, r, body);
  }

  function drawBodyOptics(ctx, cx, cy, r, body) {
    ctx.save();
    clipSphere(ctx, cx, cy, r);

    const highlight = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.36, r * 0.04, cx, cy, r);

    if (body === "sun") {
      highlight.addColorStop(0, "rgba(255,255,225,0.38)");
      highlight.addColorStop(0.24, "rgba(255,238,120,0.14)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
    } else {
      highlight.addColorStop(0, "rgba(255,255,255,0.24)");
      highlight.addColorStop(0.28, "rgba(255,255,255,0.06)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
    }

    ctx.fillStyle = highlight;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const terminator = ctx.createLinearGradient(cx - r * 0.55, cy - r, cx + r, cy + r);
    terminator.addColorStop(0, "rgba(255,255,255,0)");
    terminator.addColorStop(0.54, "rgba(0,0,0,0)");
    terminator.addColorStop(1, body === "sun" ? "rgba(80,12,0,0.18)" : "rgba(0,0,0,0.44)");

    ctx.fillStyle = terminator;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    if (body === "earth") drawAtmosphere(ctx, cx, cy, r);
    if (body === "sun") drawSolarGlow(ctx, cx, cy, r);

    drawRim(ctx, cx, cy, r, body);
  }

  function drawAtmosphere(ctx, cx, cy, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.014, 0, TAU);
    ctx.strokeStyle = "rgba(126,219,255,0.46)";
    ctx.lineWidth = Math.max(2, r * 0.028);
    ctx.shadowColor = "rgba(126,219,255,0.42)";
    ctx.shadowBlur = r * 0.07;
    ctx.stroke();
    ctx.restore();
  }

  function drawSolarGlow(ctx, cx, cy, r) {
    const corona = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.2);
    corona.addColorStop(0, "rgba(255,197,63,0.17)");
    corona.addColorStop(0.58, "rgba(255,114,26,0.12)");
    corona.addColorStop(1, "rgba(255,114,26,0)");

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.2, 0, TAU);
    ctx.fillStyle = corona;
    ctx.fill();
    ctx.restore();
  }

  function drawRim(ctx, cx, cy, r, body) {
    let stroke = "rgba(236,235,219,0.54)";
    let glow = "rgba(255,255,244,0.18)";

    if (body === "earth") {
      stroke = "rgba(134,225,255,0.64)";
      glow = "rgba(126,219,255,0.36)";
    }

    if (body === "sun") {
      stroke = "rgba(255,224,116,0.78)";
      glow = "rgba(255,166,34,0.54)";
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(2, r * 0.01);
    ctx.shadowColor = glow;
    ctx.shadowBlur = r * 0.07;
    ctx.stroke();
    ctx.restore();
  }

  function createRenderer(canvas) {
    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });

    function resize() {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
      const cssSize = clamp(rect.width || canvas.clientWidth || 420, 260, 1080);
      const dpr = clamp(global.devicePixelRatio || 1, 1, 2.5);
      const pixelSize = Math.round(cssSize * dpr);

      if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
        canvas.width = pixelSize;
        canvas.height = pixelSize;
      }
    }

    function render(options) {
      const body = normalizeBody(options && options.body);
      const longitude = Number(options && options.longitude) || 0;
      const zoom = clamp(Number(options && options.zoom) || 100, 70, 240);
      const size = Math.min(canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = size * 0.395 * (zoom / 100);
      const map = getMap(body);

      resize();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawProjectedMap(ctx, map, cx, cy, r, longitude, body);

      return {
        ok: true,
        version: VERSION,
        body,
        projection: "spherical-axis",
        textureRequired: false,
        rendererOwns: "body-drawing-only"
      };
    }

    resize();

    return {
      VERSION,
      version: VERSION,
      render,
      resize,
      getStatus() {
        return {
          ok: true,
          version: VERSION,
          role: "render-authority",
          ownsBodyDrawing: true,
          ownsRoute: false,
          ownsControls: false,
          ownsLabels: false,
          textureRequired: false
        };
      }
    };
  }

  function renderToCanvas(canvas, options) {
    return createRenderer(canvas).render(options || {});
  }

  const api = {
    VERSION,
    version: VERSION,
    createRenderer,
    renderToCanvas,
    getStatus() {
      return {
        ok: true,
        version: VERSION,
        role: "render-file",
        ownsBodyDrawing: true,
        ownsRoute: false,
        ownsControls: false,
        ownsLabels: false,
        textureRequired: false
      };
    }
  };

  global.DGBShowroomGlobeRender = api;

  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBShowroomGlobeRender = api;
})(typeof window !== "undefined" ? window : globalThis);
