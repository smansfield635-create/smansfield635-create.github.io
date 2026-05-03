/* /assets/showroom.globe.render.js
   SHOWROOM_GLOBE_RENDER_BOUNDARY_RESTORE_TNT_v1

   PRECINCT=
   SHOWROOM_GLOBE_BODY_PIXEL_RENDERER

   JURISDICTION=
   DRAW_ONE_SELECTED_BODY_ONLY:
   EARTH OR SUN OR MOON

   NON_JURISDICTION=
   ROUTE_COPY
   CONTROLS
   BUTTONS
   LABELS
   INSTRUMENT_STATE
   DEMO_UNIVERSE_RELATIONSHIP_SCENE
   MOON_ORBIT
   PLANET_1
   NINE_SUMMITS_UNIVERSE
   GAUGES
*/

(function bindShowroomGlobeRenderBoundary(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_RENDER_BOUNDARY_RESTORE_TNT_v1";
  const TAU = Math.PI * 2;
  const PI = Math.PI;
  const DEG = Math.PI / 180;
  const BODY_SET = new Set(["earth", "sun", "moon"]);
  const SOURCE_WIDTH = 2048;
  const SOURCE_HEIGHT = 1024;
  const MAX_WORK_SIZE = 760;

  const textureCache = Object.create(null);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function normalizeBody(body) {
    body = String(body || "earth").toLowerCase();
    return BODY_SET.has(body) ? body : "earth";
  }

  function wrap01(value) {
    value = value % 1;
    return value < 0 ? value + 1 : value;
  }

  function makeSeededRandom(seed) {
    let s = seed >>> 0;
    return function random() {
      s += 0x6D2B79F5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeCanvas(width, height) {
    const canvas = global.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function llToXY(lon, lat, width, height) {
    return {
      x: ((lon + 180) / 360) * width,
      y: ((90 - lat) / 180) * height
    };
  }

  function drawPolygon(ctx, points, fill, stroke, lineWidth) {
    if (!points || !points.length) return;

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const first = llToXY(points[0][0], points[0][1], width, height);

    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (let i = 1; i < points.length; i += 1) {
      const p = llToXY(points[i][0], points[i][1], width, height);
      ctx.lineTo(p.x, p.y);
    }

    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth || 1;
      ctx.stroke();
    }
  }

  function drawEllipse(ctx, lon, lat, lonR, latR, rotation, fill, stroke, lineWidth) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const p = llToXY(lon, lat, width, height);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((rotation || 0) * DEG);
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      Math.max(0.5, (lonR / 360) * width),
      Math.max(0.5, (latR / 180) * height),
      0,
      0,
      TAU
    );
    ctx.fillStyle = fill;
    ctx.fill();

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth || 1;
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSoftLine(ctx, points, stroke, lineWidth) {
    if (!points || points.length < 2) return;

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.beginPath();

    points.forEach(function eachPoint(point, index) {
      const p = llToXY(point[0], point[1], width, height);
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  function buildEarthTexture() {
    const canvas = makeCanvas(SOURCE_WIDTH, SOURCE_HEIGHT);
    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    const random = makeSeededRandom(10101);

    const ocean = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    ocean.addColorStop(0.00, "#1b477d");
    ocean.addColorStop(0.20, "#105d98");
    ocean.addColorStop(0.45, "#0f69a7");
    ocean.addColorStop(0.70, "#0a3f77");
    ocean.addColorStop(1.00, "#071f45");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    for (let i = 0; i < 1300; i += 1) {
      drawEllipse(
        ctx,
        -180 + random() * 360,
        -80 + random() * 160,
        1 + random() * 10,
        0.4 + random() * 4,
        random() * 180,
        "rgba(132,214,255," + (0.015 + random() * 0.045).toFixed(4) + ")"
      );
    }

    drawPolygon(ctx, [[-168,72],[-154,68],[-143,60],[-133,54],[-126,47],[-123,39],[-117,33],[-108,28],[-99,23],[-90,18],[-84,22],[-80,32],[-74,42],[-65,49],[-56,54],[-59,61],[-75,67],[-96,71],[-122,73],[-150,74]], "#527f43", "rgba(0,0,0,0.10)", 1.4);
    drawPolygon(ctx, [[-82,13],[-78,6],[-81,-5],[-78,-18],[-72,-32],[-65,-47],[-56,-56],[-47,-53],[-40,-38],[-38,-23],[-44,-8],[-55,4],[-69,12]], "#427c41", "rgba(0,0,0,0.10)", 1.4);
    drawPolygon(ctx, [[-55,60],[-40,63],[-30,70],[-28,77],[-36,82],[-50,82],[-60,76],[-61,68]], "#e7eef2", "rgba(255,255,255,0.18)", 1);
    drawPolygon(ctx, [[-18,36],[-6,35],[8,30],[22,20],[33,5],[38,-12],[35,-28],[26,-35],[14,-35],[4,-27],[-4,-13],[-10,4],[-15,22]], "#927746", "rgba(0,0,0,0.10)", 1.4);
    drawPolygon(ctx, [[-11,36],[-2,44],[14,49],[36,52],[58,57],[82,60],[106,56],[132,50],[154,40],[158,32],[146,25],[126,17],[108,8],[94,12],[78,23],[60,30],[42,34],[22,41],[6,43],[-7,39]], "#71894b", "rgba(0,0,0,0.10)", 1.4);
    drawPolygon(ctx, [[34,31],[45,29],[53,19],[52,12],[43,16],[36,25]], "#b99b63", "rgba(0,0,0,0.08)", 1);
    drawPolygon(ctx, [[68,24],[77,25],[84,18],[82,8],[75,10],[70,17]], "#4e7f40", "rgba(0,0,0,0.08)", 1);
    drawPolygon(ctx, [[112,-11],[124,-16],[140,-22],[150,-31],[146,-39],[132,-40],[118,-32],[112,-22]], "#b68c58", "rgba(0,0,0,0.10)", 1.4);
    drawPolygon(ctx, [[-180,-72],[-120,-77],[-60,-80],[0,-82],[60,-80],[120,-77],[180,-72],[180,-90],[-180,-90]], "#eef6ff", "rgba(255,255,255,0.16)", 1);

    drawEllipse(ctx, -104, 53, 24, 10, -10, "rgba(42,92,42,0.34)");
    drawEllipse(ctx, -111, 36, 18, 8, 0, "rgba(178,143,83,0.33)");
    drawEllipse(ctx, -62, -7, 21, 13, -16, "rgba(24,99,45,0.44)");
    drawEllipse(ctx, 20, 22, 19, 9, -7, "rgba(190,154,91,0.46)");
    drawEllipse(ctx, 79, 47, 32, 11, 0, "rgba(140,121,86,0.28)");
    drawEllipse(ctx, 114, 28, 18, 8, -4, "rgba(51,112,49,0.32)");

    for (let band = -56; band <= 56; band += 14) {
      const points = [];
      for (let lon = -180; lon <= 180; lon += 4) {
        const wobble = Math.sin((lon + band * 3.1) * 0.075) * 2.8 + Math.sin((lon - band * 1.7) * 0.16) * 1.2;
        points.push([lon, band + wobble]);
      }
      drawSoftLine(ctx, points, "rgba(255,255,255,0.10)", 2.8);
    }

    for (let i = 0; i < 650; i += 1) {
      drawEllipse(
        ctx,
        -180 + random() * 360,
        -64 + random() * 128,
        1.2 + random() * 8.5,
        0.35 + random() * 2.2,
        random() * 180,
        "rgba(255,255,255," + (0.035 + random() * 0.12).toFixed(4) + ")"
      );
    }

    const top = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT * 0.22);
    top.addColorStop(0, "rgba(255,255,255,0.28)");
    top.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT * 0.22);

    const bottom = ctx.createLinearGradient(0, SOURCE_HEIGHT, 0, SOURCE_HEIGHT * 0.78);
    bottom.addColorStop(0, "rgba(255,255,255,0.32)");
    bottom.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = bottom;
    ctx.fillRect(0, SOURCE_HEIGHT * 0.78, SOURCE_WIDTH, SOURCE_HEIGHT * 0.22);

    return ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
  }

  function buildSunTexture() {
    const canvas = makeCanvas(SOURCE_WIDTH, SOURCE_HEIGHT);
    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    const random = makeSeededRandom(20202);

    const base = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    base.addColorStop(0.00, "#ffd76b");
    base.addColorStop(0.24, "#ffb842");
    base.addColorStop(0.50, "#ff8f27");
    base.addColorStop(0.76, "#df5d14");
    base.addColorStop(1.00, "#8b2708");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < 3400; i += 1) {
      drawEllipse(
        ctx,
        -180 + random() * 360,
        -75 + random() * 150,
        0.5 + random() * 4,
        0.3 + random() * 2.2,
        random() * 180,
        random() > 0.34
          ? "rgba(255,248,190," + (0.035 + random() * 0.12).toFixed(4) + ")"
          : "rgba(255,112,35," + (0.03 + random() * 0.09).toFixed(4) + ")"
      );
    }

    ctx.globalCompositeOperation = "source-over";

    for (let row = -66; row <= 66; row += 10) {
      const points = [];
      for (let lon = -180; lon <= 180; lon += 3) {
        const wave = Math.sin((lon + row * 1.7) * 0.105) * 3.8 + Math.sin((lon - row * 2.1) * 0.045) * 2.4;
        points.push([lon, row + wave]);
      }
      drawSoftLine(ctx, points, "rgba(255,244,195,0.11)", 2.4);
    }

    for (let i = 0; i < 80; i += 1) {
      drawEllipse(
        ctx,
        -180 + random() * 360,
        -58 + random() * 116,
        4 + random() * 16,
        1.6 + random() * 7,
        random() * 180,
        "rgba(96,25,8," + (0.035 + random() * 0.08).toFixed(4) + ")"
      );
    }

    return ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
  }

  function buildMoonTexture() {
    const canvas = makeCanvas(SOURCE_WIDTH, SOURCE_HEIGHT);
    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    const random = makeSeededRandom(30303);

    const base = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    base.addColorStop(0.00, "#deded8");
    base.addColorStop(0.36, "#c9c9c2");
    base.addColorStop(0.64, "#aaa9a4");
    base.addColorStop(1.00, "#858580");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    const maria = "rgba(66,66,68,0.36)";
    drawEllipse(ctx, -22, 30, 22, 11, -10, maria);
    drawEllipse(ctx, 16, 22, 18, 10, 8, maria);
    drawEllipse(ctx, 30, 4, 26, 12, 8, maria);
    drawEllipse(ctx, -38, -18, 22, 10, -10, maria);
    drawEllipse(ctx, 62, -16, 18, 8, -6, maria);
    drawEllipse(ctx, -82, -8, 14, 7, 0, maria);
    drawEllipse(ctx, 85, 32, 20, 8, -10, "rgba(82,82,84,0.24)");

    for (let i = 0; i < 1700; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -82 + random() * 164;
      const size = 0.25 + Math.pow(random(), 2.45) * 7.2;
      const strength = 0.13 + random() * 0.48;

      drawEllipse(ctx, lon, lat, size, size * 0.68, random() * 180, "rgba(36,38,40," + (0.05 + strength * 0.10).toFixed(4) + ")");
      drawEllipse(ctx, lon - size * 0.05, lat - size * 0.05, size * 0.78, size * 0.50, random() * 180, "rgba(255,255,245," + (0.035 + strength * 0.07).toFixed(4) + ")");
    }

    return ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
  }

  function getTexture(body) {
    body = normalizeBody(body);

    if (textureCache[body]) return textureCache[body];

    const imageData = body === "sun" ? buildSunTexture() : body === "moon" ? buildMoonTexture() : buildEarthTexture();

    textureCache[body] = {
      width: imageData.width,
      height: imageData.height,
      data: imageData.data
    };

    return textureCache[body];
  }

  function sample(texture, u, v, out) {
    const width = texture.width;
    const height = texture.height;
    const data = texture.data;

    const x = wrap01(u) * width;
    const y = clamp(v, 0, 0.999999) * (height - 1);

    const x0 = Math.floor(x) % width;
    const x1 = (x0 + 1) % width;
    const y0 = Math.floor(y);
    const y1 = Math.min(height - 1, y0 + 1);
    const tx = x - Math.floor(x);
    const ty = y - y0;

    const i00 = (y0 * width + x0) * 4;
    const i10 = (y0 * width + x1) * 4;
    const i01 = (y1 * width + x0) * 4;
    const i11 = (y1 * width + x1) * 4;

    const r0 = data[i00] * (1 - tx) + data[i10] * tx;
    const g0 = data[i00 + 1] * (1 - tx) + data[i10 + 1] * tx;
    const b0 = data[i00 + 2] * (1 - tx) + data[i10 + 2] * tx;
    const r1 = data[i01] * (1 - tx) + data[i11] * tx;
    const g1 = data[i01 + 1] * (1 - tx) + data[i11 + 1] * tx;
    const b1 = data[i01 + 2] * (1 - tx) + data[i11 + 2] * tx;

    out[0] = r0 * (1 - ty) + r1 * ty;
    out[1] = g0 * (1 - ty) + g1 * ty;
    out[2] = b0 * (1 - ty) + b1 * ty;

    return out;
  }

  function axialTilt(body) {
    if (body === "earth") return -23.5 * DEG;
    if (body === "moon") return -6.5 * DEG;
    return -7.25 * DEG;
  }

  function renderSphere(ctx, targetWidth, targetHeight, body, longitudeTurns, zoom) {
    const texture = getTexture(body);
    const workSize = Math.min(MAX_WORK_SIZE, Math.max(320, Math.min(targetWidth, targetHeight)));
    const work = makeCanvas(workSize, workSize);
    const workCtx = work.getContext("2d", { alpha: true, willReadFrequently: true });
    const image = workCtx.createImageData(workSize, workSize);
    const pixels = image.data;

    const radius = workSize * 0.455;
    const center = workSize / 2;
    const radius2 = radius * radius;
    const tilt = axialTilt(body);
    const cosTilt = Math.cos(tilt);
    const sinTilt = Math.sin(tilt);
    const centerLon = longitudeTurns * TAU;

    const lx = -0.44;
    const ly = -0.30;
    const lz = 0.84;
    const color = [0, 0, 0];

    let ptr = 0;

    for (let py = 0; py < workSize; py += 1) {
      const y = py + 0.5 - center;

      for (let px = 0; px < workSize; px += 1) {
        const x = px + 0.5 - center;
        const d2 = x * x + y * y;

        if (d2 > radius2) {
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

        sample(texture, u, v, color);

        const nDotL = clamp(sx * lx + sy * ly + sz * lz, 0, 1);
        const dist = Math.sqrt(d2) / radius;
        const rim = clamp((dist - 0.65) / 0.35, 0, 1);

        let light = body === "sun" ? 0.84 + nDotL * 0.18 : 0.34 + nDotL * 0.74;
        let r = color[0] * light;
        let g = color[1] * light;
        let b = color[2] * light;

        if (body === "earth") {
          const atmosphere = rim * 32;
          r += atmosphere * 0.42;
          g += atmosphere * 0.95;
          b += atmosphere * 1.70;
        } else if (body === "sun") {
          const glow = 16 + rim * 26;
          r += glow;
          g += glow * 0.72;
          b += glow * 0.22;
        } else {
          const chalk = rim * 8;
          r += chalk;
          g += chalk;
          b += chalk;
        }

        const alpha = dist > 0.988 ? clamp((1 - dist) / 0.012, 0, 1) : 1;

        pixels[ptr] = clamp(Math.round(r), 0, 255);
        pixels[ptr + 1] = clamp(Math.round(g), 0, 255);
        pixels[ptr + 2] = clamp(Math.round(b), 0, 255);
        pixels[ptr + 3] = Math.round(255 * alpha);
        ptr += 4;
      }
    }

    workCtx.putImageData(image, 0, 0);

    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const drawSize = Math.min(targetWidth, targetHeight) * 0.92 * (zoom / 100);
    const dx = (targetWidth - drawSize) / 2;
    const dy = (targetHeight - drawSize) / 2;

    ctx.drawImage(work, dx, dy, drawSize, drawSize);

    const cx = targetWidth / 2;
    const cy = targetHeight / 2;
    const rOuter = drawSize / 2;

    if (body === "earth") {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter * 1.012, 0, TAU);
      ctx.strokeStyle = "rgba(146,224,255,0.72)";
      ctx.lineWidth = Math.max(2, rOuter * 0.014);
      ctx.shadowColor = "rgba(88,180,255,0.42)";
      ctx.shadowBlur = rOuter * 0.08;
      ctx.stroke();
      ctx.restore();
    }

    if (body === "sun") {
      ctx.save();
      const corona = ctx.createRadialGradient(cx, cy, rOuter * 0.82, cx, cy, rOuter * 1.24);
      corona.addColorStop(0.00, "rgba(255,226,110,0.18)");
      corona.addColorStop(0.62, "rgba(255,128,26,0.14)");
      corona.addColorStop(1.00, "rgba(255,128,26,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter * 1.24, 0, TAU);
      ctx.fillStyle = corona;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter * 1.006, 0, TAU);
      ctx.strokeStyle = "rgba(255,220,118,0.72)";
      ctx.lineWidth = Math.max(2, rOuter * 0.012);
      ctx.shadowColor = "rgba(255,161,33,0.42)";
      ctx.shadowBlur = rOuter * 0.08;
      ctx.stroke();
      ctx.restore();
    }

    if (body === "moon") {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter * 1.002, 0, TAU);
      ctx.strokeStyle = "rgba(238,238,232,0.56)";
      ctx.lineWidth = Math.max(2, rOuter * 0.010);
      ctx.stroke();
      ctx.restore();
    }

    return {
      ok: true,
      version: VERSION,
      body: body,
      selectedBodyOnly: true,
      projection: "orthographic-sphere",
      routeDrawsBody: false,
      instrumentDrawsBody: false,
      renderDrawsBody: true,
      demoUniverseRelationship: false,
      moonOrbit: false,
      planetOne: "reserved",
      generatedImage: false,
      visualPassClaimed: false
    };
  }

  function createRenderer(canvas) {
    const ctx = canvas.getContext("2d", { alpha: true });

    function resize() {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
      const cssSize = clamp(Math.round(rect.width || canvas.clientWidth || 420), 260, 1100);
      const dpr = clamp(global.devicePixelRatio || 1, 1, 2.5);
      const pixelSize = Math.round(cssSize * dpr);

      if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
        canvas.width = pixelSize;
        canvas.height = pixelSize;
      }
    }

    function render(options) {
      options = options || {};
      resize();

      const body = normalizeBody(options.body);
      const longitude = Number(options.longitude) || 0;
      const zoom = clamp(Number(options.zoom) || 100, 70, 180);

      return renderSphere(ctx, canvas.width, canvas.height, body, longitude, zoom);
    }

    return {
      VERSION,
      version: VERSION,
      resize,
      render,
      getStatus() {
        return {
          ok: true,
          version: VERSION,
          role: "render-authority-only",
          selectedBodyOnly: true,
          rendererOwnsBodies: true,
          routeOwnsBodies: false,
          instrumentOwnsBodies: false,
          demoUniverseRelationship: false,
          moonOrbit: false,
          planetOne: "reserved",
          generatedImage: false,
          visualPassClaimed: false
        };
      }
    };
  }

  function renderToCanvas(canvas, options) {
    const renderer = createRenderer(canvas);
    return renderer.render(options || {});
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
        role: "render-authority-only",
        selectedBodyOnly: true,
        rendererOwnsBodies: true,
        routeOwnsBodies: false,
        instrumentOwnsBodies: false,
        demoUniverseRelationship: false,
        moonOrbit: false,
        planetOne: "reserved",
        generatedImage: false,
        visualPassClaimed: false
      };
    }
  };

  global.DGBShowroomGlobeRender = api;
  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBShowroomGlobeRender = api;
})(typeof window !== "undefined" ? window : globalThis);
