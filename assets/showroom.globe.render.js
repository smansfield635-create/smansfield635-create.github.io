/* /assets/showroom.globe.render.js
   SHOWROOM_GLOBE_TRUE_SPHERE_RENDER_RENEWAL_TNT_v1

   ROLE:
   Render authority only.

   PURPOSE:
   Stop strip/slab/flat-disk behavior.
   Render Earth, Sun, and Moon through inverse spherical projection.
   Keep procedural satellite-style definition without external texture dependency.

   OWNS:
   Earth/Sun/Moon drawing only.
   Axis-globe projection.
   Surface definition.

   DOES_NOT_OWN:
   Route copy.
   Labels.
   Buttons.
   Controls.
   Mount selection.
   Instrument API.
   Gauges.
*/

(function bindShowroomGlobeTrueSphereRender(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_TRUE_SPHERE_RENDER_RENEWAL_TNT_v1";
  const TAU = Math.PI * 2;
  const PI = Math.PI;
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

  const textureCache = {
    earth: null,
    sun: null,
    moon: null
  };

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
    const canvas = global.document.createElement("canvas");
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

  function buildEarthTexture() {
    const width = 2048;
    const height = 1024;
    const canvas = makeCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const ocean = ctx.createLinearGradient(0, 0, width, height);
    ocean.addColorStop(0, "#051c4d");
    ocean.addColorStop(0.28, "#0b70ab");
    ocean.addColorStop(0.58, "#073f91");
    ocean.addColorStop(1, "#011331");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 1500; i += 1) {
      const x = rand(i + 10) * width;
      const y = rand(i + 20) * height;
      const radius = 1 + rand(i + 30) * 10;
      const alpha = 0.025 + rand(i + 40) * 0.06;

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

    for (let i = 0; i < 1800; i += 1) {
      const x = rand(i + 300) * width;
      const y = rand(i + 400) * height;
      const n = octaveNoise(x / 90, y / 90, 12);

      if (n < 0.48) continue;

      ctx.beginPath();
      ctx.ellipse(x, y, 8 + n * 22, 4 + n * 9, rand(i + 500) * TAU, 0, TAU);
      ctx.fillStyle = `rgba(34, 82, 41, ${0.08 + n * 0.13})`;
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";

    for (let i = 0; i < 760; i += 1) {
      const x = rand(i + 700) * width;
      const y = rand(i + 800) * height;
      const n = octaveNoise(x / 110, y / 70, 55);

      if (n < 0.55) continue;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rand(i + 900) - 0.5) * 0.8);
      ctx.beginPath();
      ctx.ellipse(0, 0, 24 + n * 72, 5 + n * 14, 0, 0, TAU);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.08 + n * 0.16})`;
      ctx.fill();
      ctx.restore();
    }

    return ctx.getImageData(0, 0, width, height);
  }

  function buildSunTexture() {
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

    for (let i = 0; i < 2400; i += 1) {
      const x = rand(i + 1200) * width;
      const y = rand(i + 1300) * height;
      const n = octaveNoise(x / 60, y / 60, 91);
      const radius = 3 + n * 16;
      const alpha = 0.07 + n * 0.2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rand(i + 1400) * TAU);
      ctx.scale(2.3 + rand(i + 1500) * 2.1, 0.72);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, TAU);
      ctx.fillStyle = n > 0.6
        ? `rgba(255, 235, 112, ${alpha})`
        : `rgba(255, 123, 26, ${alpha * 0.72})`;
      ctx.fill();
      ctx.restore();
    }

    for (let i = 0; i < 30; i += 1) {
      const x = rand(i + 1700) * width;
      const y = rand(i + 1800) * height;
      const r = 35 + rand(i + 1900) * 120;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, r);

      glow.addColorStop(0, "rgba(255, 248, 180, 0.25)");
      glow.addColorStop(0.5, "rgba(255, 169, 45, 0.11)");
      glow.addColorStop(1, "rgba(255, 80, 18, 0)");

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }

    return ctx.getImageData(0, 0, width, height);
  }

  function buildMoonTexture() {
    const width = 2048;
    const height = 1024;
    const canvas = makeCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const base = ctx.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, "#8f938f");
    base.addColorStop(0.45, "#d3d2c8");
    base.addColorStop(1, "#60686f");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    for (let y = 0; y < height; y += 3) {
      for (let x = 0; x < width; x += 3) {
        const n = octaveNoise(x / 75, y / 75, 203);
        const v = Math.floor(65 + n * 95);
        ctx.fillStyle = `rgba(${v}, ${v}, ${v}, 0.14)`;
        ctx.fillRect(x, y, 3, 3);
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
      ctx.fillStyle = "rgba(58, 63, 65, 0.26)";
      ctx.fill();
      ctx.restore();
    });

    for (let i = 0; i < 520; i += 1) {
      const x = rand(i + 2200) * width;
      const y = rand(i + 2300) * height;
      const r = 1.6 + Math.pow(rand(i + 2400), 2.1) * 28;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = "rgba(38, 40, 42, 0.12)";
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 245, 0.2)";
      ctx.lineWidth = Math.max(1, r * 0.1);
      ctx.stroke();

      if (r > 12) {
        for (let ray = 0; ray < 8; ray += 1) {
          const angle = (ray / 8) * TAU + rand(i + ray) * 0.28;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + Math.cos(angle) * r * (2 + rand(i + ray + 80) * 2.6),
            y + Math.sin(angle) * r * (2 + rand(i + ray + 90) * 2.6)
          );
          ctx.strokeStyle = "rgba(255, 255, 245, 0.065)";
          ctx.lineWidth = Math.max(1, r * 0.045);
          ctx.stroke();
        }
      }
    }

    return ctx.getImageData(0, 0, width, height);
  }

  function getTexture(body) {
    body = normalizeBody(body);

    if (!textureCache.earth) textureCache.earth = buildEarthTexture();
    if (!textureCache.sun) textureCache.sun = buildSunTexture();
    if (!textureCache.moon) textureCache.moon = buildMoonTexture();

    return textureCache[body];
  }

  function sampleTexture(texture, u, v) {
    u = ((u % 1) + 1) % 1;
    v = clamp(v, 0, 1);

    const x = Math.floor(u * (texture.width - 1));
    const y = Math.floor(v * (texture.height - 1));
    const index = (y * texture.width + x) * 4;
    const data = texture.data;

    return [
      data[index],
      data[index + 1],
      data[index + 2],
      data[index + 3]
    ];
  }

  function bodyTilt(body) {
    if (body === "sun") return -7.25 * DEG;
    if (body === "moon") return -6.68 * DEG;
    return -23.5 * DEG;
  }

  function lightFactor(body, sx, sy, sz) {
    if (body === "sun") {
      return 0.78 + 0.22 * sz;
    }

    const lx = -0.45;
    const ly = 0.34;
    const lz = 0.84;
    const dot = sx * lx + sy * ly + sz * lz;

    return clamp(0.38 + Math.max(0, dot) * 0.76, 0.28, 1.08);
  }

  function drawTrueSphere(ctx, canvas, options) {
    const body = normalizeBody(options.body);
    const longitude = Number(options.longitude) || 0;
    const zoom = clamp(Number(options.zoom) || 100, 70, 240);
    const texture = getTexture(body);

    const size = Math.min(canvas.width, canvas.height);
    const renderSize = Math.min(size, 760);
    const work = makeCanvas(renderSize, renderSize);
    const workCtx = work.getContext("2d");
    const image = workCtx.createImageData(renderSize, renderSize);
    const data = image.data;

    const cx = renderSize / 2;
    const cy = renderSize / 2;
    const radius = renderSize * 0.395 * (zoom / 100);
    const radius2 = radius * radius;
    const tilt = bodyTilt(body);
    const cosT = Math.cos(-tilt);
    const sinT = Math.sin(-tilt);

    for (let y = 0; y < renderSize; y += 1) {
      for (let x = 0; x < renderSize; x += 1) {
        const dx = x - cx;
        const dy = y - cy;
        const d2 = dx * dx + dy * dy;
        const offset = (y * renderSize + x) * 4;

        if (d2 > radius2) {
          data[offset] = 0;
          data[offset + 1] = 0;
          data[offset + 2] = 0;
          data[offset + 3] = 0;
          continue;
        }

        const sx = dx / radius;
        const sy = -dy / radius;
        const sz = Math.sqrt(Math.max(0, 1 - sx * sx - sy * sy));

        const tx = sx * cosT - sy * sinT;
        const ty = sx * sinT + sy * cosT;
        const tz = sz;

        let lon = Math.atan2(tx, tz) / TAU + 0.5 + longitude;
        lon = ((lon % 1) + 1) % 1;

        const lat = Math.asin(clamp(ty, -1, 1));
        const v = 0.5 - lat / PI;

        const color = sampleTexture(texture, lon, v);
        const light = lightFactor(body, sx, sy, sz);
        const limb = clamp(sz * 1.18, 0, 1);
        const alphaEdge = clamp((radius - Math.sqrt(d2)) / 2.5, 0, 1);

        let r = color[0] * light;
        let g = color[1] * light;
        let b = color[2] * light;

        if (body === "earth") {
          r *= 0.94 + limb * 0.08;
          g *= 0.96 + limb * 0.08;
          b *= 1.02 + limb * 0.1;
        }

        if (body === "sun") {
          r *= 1.08;
          g *= 1.03;
          b *= 0.86;
        }

        if (body === "moon") {
          const gray = (r + g + b) / 3;
          r = gray * 1.03;
          g = gray * 1.03;
          b = gray;
        }

        data[offset] = clamp(Math.round(r), 0, 255);
        data[offset + 1] = clamp(Math.round(g), 0, 255);
        data[offset + 2] = clamp(Math.round(b), 0, 255);
        data[offset + 3] = Math.round(255 * alphaEdge);
      }
    }

    workCtx.putImageData(image, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      work,
      (canvas.width - renderSize) / 2,
      (canvas.height - renderSize) / 2,
      renderSize,
      renderSize
    );
    ctx.restore();

    drawBodyOptics(ctx, canvas.width / 2, canvas.height / 2, radius * (canvas.width / renderSize), body);
  }

  function drawBodyOptics(ctx, cx, cy, radius, body) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.clip();

    const highlight = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.36, radius * 0.04, cx, cy, radius);

    if (body === "sun") {
      highlight.addColorStop(0, "rgba(255,255,225,0.34)");
      highlight.addColorStop(0.24, "rgba(255,238,120,0.12)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
    } else {
      highlight.addColorStop(0, "rgba(255,255,255,0.24)");
      highlight.addColorStop(0.28, "rgba(255,255,255,0.06)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
    }

    ctx.fillStyle = highlight;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const terminator = ctx.createLinearGradient(cx - radius * 0.55, cy - radius, cx + radius, cy + radius);
    terminator.addColorStop(0, "rgba(255,255,255,0)");
    terminator.addColorStop(0.56, "rgba(0,0,0,0)");
    terminator.addColorStop(1, body === "sun" ? "rgba(80,12,0,0.14)" : "rgba(0,0,0,0.44)");

    ctx.fillStyle = terminator;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    if (body === "earth") {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.014, 0, TAU);
      ctx.strokeStyle = "rgba(126,219,255,0.46)";
      ctx.lineWidth = Math.max(2, radius * 0.028);
      ctx.shadowColor = "rgba(126,219,255,0.42)";
      ctx.shadowBlur = radius * 0.07;
      ctx.stroke();
      ctx.restore();
    }

    if (body === "sun") {
      const corona = ctx.createRadialGradient(cx, cy, radius * 0.88, cx, cy, radius * 1.2);
      corona.addColorStop(0, "rgba(255,197,63,0.17)");
      corona.addColorStop(0.58, "rgba(255,114,26,0.12)");
      corona.addColorStop(1, "rgba(255,114,26,0)");

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.2, 0, TAU);
      ctx.fillStyle = corona;
      ctx.fill();
      ctx.restore();
    }

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
    ctx.arc(cx, cy, radius, 0, TAU);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(2, radius * 0.01);
    ctx.shadowColor = glow;
    ctx.shadowBlur = radius * 0.07;
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
      resize();

      const body = normalizeBody(options && options.body);
      const longitude = Number(options && options.longitude) || 0;
      const zoom = clamp(Number(options && options.zoom) || 100, 70, 240);

      drawTrueSphere(ctx, canvas, {
        body,
        longitude,
        zoom
      });

      return {
        ok: true,
        version: VERSION,
        body,
        projection: "true-inverse-spherical",
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
          projection: "true-inverse-spherical",
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
        projection: "true-inverse-spherical",
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
