/* /assets/showroom.globe.render.js
   SHOWROOM_GLOBE_RENDER_MODEL_AFTER_DEMO_UNIVERSE_G1_TNT_v1

   PRECINCT=
   SHOWROOM_GLOBE_BODY_RENDER_LAYER

   JURISDICTION=
   DRAW_EARTH_SUN_MOON_BODY_PIXELS_ONLY

   NON_JURISDICTION=
   ROUTE_COPY
   CONTROLS
   BUTTONS
   LABEL_LAYOUT
   INSTRUMENT_STATE
   GAUGES
   PLANET_1
   NINE_SUMMITS_UNIVERSE

   MODEL_SOURCE=
   /nine-summits/universe/ embedded runtime structure:
   seeded high-detail canvas generation,
   real-body visual direction,
   radial lighting,
   clipping,
   receipt/status exposure,
   no generated image,
   no fantasy mode.

   PURPOSE=
   Bring Showroom Globe body quality closer to the Demo Universe page.
   Preserve globe geometry and axis behavior.
   Use real-world Earth/Sun/Moon models as the visual standard.
*/

(function bindShowroomGlobeDemoUniverseModeledRender(global) {
  "use strict";

  const VERSION = "SHOWROOM_GLOBE_RENDER_MODEL_AFTER_DEMO_UNIVERSE_G1_TNT_v1";
  const TAU = Math.PI * 2;
  const PI = Math.PI;
  const DEG = Math.PI / 180;
  const BODY_SET = new Set(["earth", "sun", "moon"]);

  const SOURCE_WIDTH = 4096;
  const SOURCE_HEIGHT = 2048;
  const MAX_SPHERE_RENDER_SIZE = 1120;

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

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
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
    const canvas = document.createElement("canvas");
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

  function drawLonLatPolygon(ctx, points, fill, stroke, lineWidth) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    if (!points || !points.length) return;

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

  function drawLonLatEllipse(ctx, lon, lat, lonRadius, latRadius, rotation, fill, stroke, lineWidth) {
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
      Math.max(0.5, (lonRadius / 360) * width),
      Math.max(0.5, (latRadius / 180) * height),
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

  function drawSoftStroke(ctx, points, stroke, lineWidth) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    if (!points || points.length < 2) return;

    ctx.beginPath();

    points.forEach(function pointToPath(point, index) {
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
    const random = makeSeededRandom(20260503);

    const ocean = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    ocean.addColorStop(0.00, "#1c477f");
    ocean.addColorStop(0.16, "#125d98");
    ocean.addColorStop(0.36, "#0e6aa8");
    ocean.addColorStop(0.52, "#0d5795");
    ocean.addColorStop(0.72, "#0a3f76");
    ocean.addColorStop(1.00, "#071f45");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    for (let i = 0; i < 2400; i += 1) {
      const x = random() * SOURCE_WIDTH;
      const y = random() * SOURCE_HEIGHT;
      const rx = 12 + random() * 82;
      const ry = 5 + random() * 38;
      const alpha = 0.015 + random() * 0.05;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(random() * TAU);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
      ctx.fillStyle = "rgba(132,214,255," + alpha.toFixed(4) + ")";
      ctx.fill();
      ctx.restore();
    }

    const northAmerica = [
      [-168, 72], [-156, 69], [-148, 62], [-139, 58], [-132, 53], [-126, 49],
      [-124, 44], [-122, 39], [-118, 34], [-113, 31], [-108, 28], [-103, 24],
      [-97, 21], [-91, 18], [-86, 19], [-83, 25], [-81, 30], [-78, 36],
      [-74, 42], [-69, 47], [-62, 50], [-56, 54], [-58, 59], [-66, 63],
      [-78, 67], [-94, 70], [-112, 72], [-134, 74], [-154, 74]
    ];

    const southAmerica = [
      [-82, 13], [-78, 7], [-80, -2], [-81, -10], [-77, -19], [-73, -28],
      [-69, -38], [-63, -50], [-55, -56], [-47, -53], [-42, -43], [-38, -31],
      [-39, -20], [-43, -9], [-50, 1], [-58, 8], [-70, 12]
    ];

    const greenland = [
      [-54, 60], [-42, 62], [-31, 69], [-28, 76], [-34, 82], [-47, 83],
      [-59, 79], [-61, 70]
    ];

    const africa = [
      [-18, 36], [-8, 35], [4, 31], [17, 26], [27, 16], [34, 3],
      [38, -11], [36, -24], [30, -34], [20, -36], [10, -33], [2, -25],
      [-5, -12], [-9, 1], [-13, 17], [-17, 29]
    ];

    const europeAsia = [
      [-11, 36], [-5, 43], [8, 48], [22, 50], [38, 52], [56, 56],
      [78, 60], [98, 58], [120, 53], [140, 48], [156, 41], [160, 34],
      [148, 27], [136, 20], [122, 16], [110, 8], [100, 8], [91, 16],
      [78, 24], [64, 29], [50, 32], [36, 35], [24, 40], [12, 43],
      [0, 42], [-7, 39]
    ];

    const arabia = [
      [34, 31], [44, 29], [51, 21], [55, 15], [51, 12], [43, 16], [36, 25]
    ];

    const india = [
      [68, 24], [76, 25], [83, 20], [86, 13], [81, 7], [75, 10], [70, 17]
    ];

    const southeastAsia = [
      [94, 21], [102, 18], [108, 11], [106, 2], [100, 1], [96, 9]
    ];

    const australia = [
      [112, -11], [122, -15], [134, -20], [146, -28], [148, -37],
      [138, -41], [126, -37], [116, -31], [112, -22]
    ];

    const antarctica = [
      [-180, -72], [-140, -75], [-100, -78], [-60, -80], [-20, -82],
      [20, -82], [60, -80], [100, -78], [140, -75], [180, -72],
      [180, -90], [-180, -90]
    ];

    drawLonLatPolygon(ctx, northAmerica, "#4d7c43", "rgba(0,0,0,0.10)", 2);
    drawLonLatPolygon(ctx, southAmerica, "#3f7a40", "rgba(0,0,0,0.10)", 2);
    drawLonLatPolygon(ctx, greenland, "#e7eef2", "rgba(255,255,255,0.18)", 2);
    drawLonLatPolygon(ctx, africa, "#8e7743", "rgba(0,0,0,0.10)", 2);
    drawLonLatPolygon(ctx, europeAsia, "#6f8748", "rgba(0,0,0,0.10)", 2);
    drawLonLatPolygon(ctx, arabia, "#b89961", "rgba(0,0,0,0.08)", 1);
    drawLonLatPolygon(ctx, india, "#4b7c3e", "rgba(0,0,0,0.08)", 1);
    drawLonLatPolygon(ctx, southeastAsia, "#4c8244", "rgba(0,0,0,0.08)", 1);
    drawLonLatPolygon(ctx, australia, "#b48a55", "rgba(0,0,0,0.10)", 2);
    drawLonLatPolygon(ctx, antarctica, "#eef6ff", "rgba(255,255,255,0.16)", 2);

    drawLonLatEllipse(ctx, -103, 53, 24, 10, -10, "rgba(42,92,42,0.34)");
    drawLonLatEllipse(ctx, -111, 36, 18, 8, 0, "rgba(178,143,83,0.33)");
    drawLonLatEllipse(ctx, -62, -7, 21, 13, -16, "rgba(24,99,45,0.44)");
    drawLonLatEllipse(ctx, 18, 22, 19, 9, -7, "rgba(190,154,91,0.46)");
    drawLonLatEllipse(ctx, 44, 25, 14, 7, 0, "rgba(201,168,102,0.46)");
    drawLonLatEllipse(ctx, 78, 47, 32, 11, 0, "rgba(140,121,86,0.28)");
    drawLonLatEllipse(ctx, 113, 28, 18, 8, -4, "rgba(51,112,49,0.32)");
    drawLonLatEllipse(ctx, 136, -25, 18, 10, 10, "rgba(200,169,105,0.42)");

    for (let i = 0; i < 900; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -74 + random() * 148;
      const rx = 0.8 + random() * 4.5;
      const ry = 0.25 + random() * 1.6;
      const alpha = 0.025 + random() * 0.075;
      const white = random() > 0.6;
      drawLonLatEllipse(
        ctx,
        lon,
        lat,
        rx,
        ry,
        random() * 180,
        white ? "rgba(245,245,230," + alpha.toFixed(4) + ")" : "rgba(0,0,0," + (alpha * 0.45).toFixed(4) + ")"
      );
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let band = -58; band <= 58; band += 13) {
      const points = [];
      for (let lon = -180; lon <= 180; lon += 3) {
        const wobble =
          Math.sin((lon + band * 3.1) * 0.075) * 2.8 +
          Math.sin((lon - band * 1.7) * 0.16) * 1.2;
        points.push([lon, band + wobble]);
      }
      drawSoftStroke(ctx, points, "rgba(255,255,255,0.10)", 3);
    }

    for (let i = 0; i < 1280; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -65 + random() * 130;
      const rx = 1.3 + random() * 9.8;
      const ry = 0.4 + random() * 2.4;
      const alpha = 0.035 + random() * 0.12;

      drawLonLatEllipse(
        ctx,
        lon,
        lat,
        rx,
        ry,
        random() * 180,
        "rgba(255,255,255," + alpha.toFixed(4) + ")"
      );
    }

    const polarNorth = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT * 0.22);
    polarNorth.addColorStop(0, "rgba(255,255,255,0.30)");
    polarNorth.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = polarNorth;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT * 0.22);

    const polarSouth = ctx.createLinearGradient(0, SOURCE_HEIGHT, 0, SOURCE_HEIGHT * 0.78);
    polarSouth.addColorStop(0, "rgba(255,255,255,0.34)");
    polarSouth.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = polarSouth;
    ctx.fillRect(0, SOURCE_HEIGHT * 0.78, SOURCE_WIDTH, SOURCE_HEIGHT * 0.22);

    return ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
  }

  function buildSunTexture() {
    const canvas = makeCanvas(SOURCE_WIDTH, SOURCE_HEIGHT);
    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    const random = makeSeededRandom(7711);

    const base = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    base.addColorStop(0.00, "#ffd76b");
    base.addColorStop(0.22, "#ffba43");
    base.addColorStop(0.46, "#ff8f27");
    base.addColorStop(0.72, "#df5d14");
    base.addColorStop(1.00, "#8b2708");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < 8200; i += 1) {
      const x = random() * SOURCE_WIDTH;
      const y = random() * SOURCE_HEIGHT;
      const rx = 2 + random() * 14;
      const ry = 1 + random() * 6;
      const alpha = 0.025 + random() * 0.105;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(random() * TAU);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
      ctx.fillStyle = random() > 0.34
        ? "rgba(255,248,190," + alpha.toFixed(4) + ")"
        : "rgba(255,112,35," + (alpha * 0.72).toFixed(4) + ")";
      ctx.fill();
      ctx.restore();
    }

    for (let i = 0; i < 260; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -65 + random() * 130;
      const rx = 3 + random() * 18;
      const ry = 1.6 + random() * 8;
      const alpha = 0.04 + random() * 0.18;

      drawLonLatEllipse(
        ctx,
        lon,
        lat,
        rx,
        ry,
        random() * 180,
        "rgba(255,245,165," + alpha.toFixed(4) + ")"
      );
    }

    ctx.globalCompositeOperation = "source-over";

    for (let row = -66; row <= 66; row += 10) {
      const points = [];
      for (let lon = -180; lon <= 180; lon += 3) {
        const wave =
          Math.sin((lon + row * 1.7) * 0.105) * 3.8 +
          Math.sin((lon - row * 2.1) * 0.045) * 2.4;
        points.push([lon, row + wave]);
      }

      drawSoftStroke(ctx, points, "rgba(255,244,195,0.11)", 3);
    }

    for (let i = 0; i < 140; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -58 + random() * 116;
      const rx = 4 + random() * 16;
      const ry = 1.6 + random() * 7;

      drawLonLatEllipse(
        ctx,
        lon,
        lat,
        rx,
        ry,
        random() * 180,
        "rgba(96,25,8," + (0.035 + random() * 0.08).toFixed(4) + ")"
      );
    }

    return ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
  }

  function buildMoonTexture() {
    const canvas = makeCanvas(SOURCE_WIDTH, SOURCE_HEIGHT);
    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    const random = makeSeededRandom(8802);

    const base = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    base.addColorStop(0.00, "#deded8");
    base.addColorStop(0.36, "#c9c9c2");
    base.addColorStop(0.64, "#aaa9a4");
    base.addColorStop(1.00, "#858580");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    const maria = "rgba(66,66,68,0.36)";
    drawLonLatEllipse(ctx, -22, 30, 22, 11, -10, maria);
    drawLonLatEllipse(ctx, 16, 22, 18, 10, 8, maria);
    drawLonLatEllipse(ctx, 30, 4, 26, 12, 8, maria);
    drawLonLatEllipse(ctx, -38, -18, 22, 10, -10, maria);
    drawLonLatEllipse(ctx, 62, -16, 18, 8, -6, maria);
    drawLonLatEllipse(ctx, -82, -8, 14, 7, 0, maria);
    drawLonLatEllipse(ctx, 85, 32, 20, 8, -10, "rgba(82,82,84,0.24)");

    for (let i = 0; i < 3000; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -82 + random() * 164;
      const size = 0.25 + Math.pow(random(), 2.5) * 7.6;
      const strength = 0.14 + random() * 0.52;

      drawLonLatEllipse(
        ctx,
        lon,
        lat,
        size,
        size * 0.68,
        random() * 180,
        "rgba(36,38,40," + (0.05 + strength * 0.11).toFixed(4) + ")"
      );

      drawLonLatEllipse(
        ctx,
        lon - size * 0.05,
        lat - size * 0.05,
        size * 0.78,
        size * 0.50,
        random() * 180,
        "rgba(255,255,245," + (0.035 + strength * 0.075).toFixed(4) + ")"
      );
    }

    for (let i = 0; i < 2000; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -86 + random() * 172;
      const size = 0.15 + random() * 1.1;
      const tone = random() > 0.5 ? 255 : 30;
      const alpha = 0.018 + random() * 0.055;

      drawLonLatEllipse(
        ctx,
        lon,
        lat,
        size,
        size * 0.7,
        random() * 180,
        "rgba(" + tone + "," + tone + "," + tone + "," + alpha.toFixed(4) + ")"
      );
    }

    return ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
  }

  function getTexture(body) {
    body = normalizeBody(body);

    if (textureCache[body]) return textureCache[body];

    const imageData =
      body === "sun"
        ? buildSunTexture()
        : body === "moon"
          ? buildMoonTexture()
          : buildEarthTexture();

    textureCache[body] = {
      width: imageData.width,
      height: imageData.height,
      data: imageData.data
    };

    return textureCache[body];
  }

  function sampleTexture(texture, u, v, out) {
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

  function drawSphere(ctx, targetWidth, targetHeight, body, longitudeTurns, zoomPercent) {
    const texture = getTexture(body);
    const workSize = Math.min(MAX_SPHERE_RENDER_SIZE, Math.max(360, Math.min(targetWidth, targetHeight)));
    const work = makeCanvas(workSize, workSize);
    const workCtx = work.getContext("2d", { alpha: true, willReadFrequently: true });
    const image = workCtx.createImageData(workSize, workSize);
    const pixels = image.data;

    const radius = workSize * 0.46 * (zoomPercent / 100);
    const center = workSize / 2;
    const radius2 = radius * radius;
    const tilt = axialTilt(body);
    const cosTilt = Math.cos(tilt);
    const sinTilt = Math.sin(tilt);
    const centerLon = longitudeTurns * TAU;
    const color = [0, 0, 0];

    const lightX = -0.44;
    const lightY = -0.30;
    const lightZ = 0.84;
    const lightMag = Math.sqrt(lightX * lightX + lightY * lightY + lightZ * lightZ);
    const lx = lightX / lightMag;
    const ly = lightY / lightMag;
    const lz = lightZ / lightMag;

    const hx0 = lx;
    const hy0 = ly;
    const hz0 = lz + 1;
    const hmag = Math.sqrt(hx0 * hx0 + hy0 * hy0 + hz0 * hz0);
    const hx = hx0 / hmag;
    const hy = hy0 / hmag;
    const hz = hz0 / hmag;

    let ptr = 0;

    for (let py = 0; py < workSize; py += 1) {
      const y = py + 0.5 - center;

      for (let px = 0; px < workSize; px += 1) {
        const x = px + 0.5 - center;
        const d2 = x * x + y * y;

        if (d2 > radius2) {
          pixels[ptr] = 0;
          pixels[ptr + 1] = 0;
          pixels[ptr + 2] = 0;
          pixels[ptr + 3] = 0;
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

        sampleTexture(texture, u, v, color);

        const nDotL = clamp(sx * lx + sy * ly + sz * lz, 0, 1);
        const nDotH = clamp(sx * hx + sy * hy + sz * hz, 0, 1);
        const dist = Math.sqrt(d2) / radius;
        const rim = smoothstep(0.68, 1.0, dist);

        let baseLight =
          body === "sun"
            ? 0.82 + nDotL * 0.18
            : 0.31 + nDotL * 0.76;

        let r = color[0] * baseLight;
        let g = color[1] * baseLight;
        let b = color[2] * baseLight;

        if (body === "earth") {
          const oceanish = color[2] > color[1] + 10 && color[2] > color[0] + 18;
          const spec = oceanish ? Math.pow(nDotH, 48) * 0.42 : Math.pow(nDotH, 80) * 0.05;
          const atmosphere = rim * 34;

          r += spec * 120 + atmosphere * 0.45;
          g += spec * 150 + atmosphere * 1.0;
          b += spec * 215 + atmosphere * 1.75;
        } else if (body === "sun") {
          const internalGlow = 18 + rim * 28;
          r += internalGlow;
          g += internalGlow * 0.72;
          b += internalGlow * 0.24;
        } else {
          const chalk = rim * 10;
          const spec = Math.pow(nDotH, 70) * 0.07;

          r += chalk + spec * 36;
          g += chalk + spec * 36;
          b += chalk + spec * 36;
        }

        const edgeAlpha = clamp((1.0 - dist) / 0.018, 0, 1);

        pixels[ptr] = clamp(Math.round(r), 0, 255);
        pixels[ptr + 1] = clamp(Math.round(g), 0, 255);
        pixels[ptr + 2] = clamp(Math.round(b), 0, 255);
        pixels[ptr + 3] = Math.round(255 * edgeAlpha);
        ptr += 4;
      }
    }

    workCtx.putImageData(image, 0, 0);

    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const drawSize = Math.min(targetWidth, targetHeight) * 0.92 * (zoomPercent / 100);
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
      ctx.strokeStyle = "rgba(146,224,255,0.74)";
      ctx.lineWidth = Math.max(2, rOuter * 0.014);
      ctx.shadowColor = "rgba(88,180,255,0.44)";
      ctx.shadowBlur = rOuter * 0.09;
      ctx.stroke();
      ctx.restore();
    }

    if (body === "sun") {
      ctx.save();
      const corona = ctx.createRadialGradient(cx, cy, rOuter * 0.82, cx, cy, rOuter * 1.23);
      corona.addColorStop(0.00, "rgba(255,226,110,0.18)");
      corona.addColorStop(0.60, "rgba(255,128,26,0.14)");
      corona.addColorStop(1.00, "rgba(255,128,26,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter * 1.23, 0, TAU);
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
      ctx.lineWidth = Math.max(2, rOuter * 0.01);
      ctx.stroke();
      ctx.restore();
    }

    return {
      ok: true,
      version: VERSION,
      body,
      sourceDefinition: 4096,
      projection: "orthographic-sphere",
      model: "demo-universe-g1-modeled-real-body",
      fantasyMode: false,
      generatedImage: false
    };
  }

  function createRenderer(canvas) {
    const ctx = canvas.getContext("2d", { alpha: true });

    function resize() {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
      const cssSize = clamp(Math.round(rect.width || canvas.clientWidth || 420), 260, 1400);
      const dpr = clamp(global.devicePixelRatio || 1, 1, 3);
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
      const zoom = clamp(Number(options.zoom) || 100, 70, 240);

      return drawSphere(ctx, canvas.width, canvas.height, body, longitude, zoom);
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
          rendererOwnsBodies: true,
          routeOwnsBodies: false,
          controlsOwnedHere: false,
          sourceDefinition: 4096,
          model: "demo-universe-g1-modeled-real-body",
          fantasyMode: false,
          generatedImage: false
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
        rendererOwnsBodies: true,
        routeOwnsBodies: false,
        controlsOwnedHere: false,
        sourceDefinition: 4096,
        model: "demo-universe-g1-modeled-real-body",
        fantasyMode: false,
        generatedImage: false
      };
    }
  };

  global.DGBShowroomGlobeRender = api;
  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBShowroomGlobeRender = api;
})(typeof window !== "undefined" ? window : globalThis);
