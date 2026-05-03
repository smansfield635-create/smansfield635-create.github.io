/* /assets/showroom.globe.render.js
   AUDRELIA_SHOWROOM_GLOBE_RENDER_TNT_v1

   ROLE=
   RENDER_AUTHORITY_ONLY

   OWNS=
   AUDRELIA_BODY_PIXELS
   AUDRELIA_SUN_BODY_PIXELS
   SOLAR_SYSTEM_SUN_BODY_PIXELS

   DOES_NOT_OWN=
   ROUTE_COPY
   CONTROLS
   BUTTONS
   INSTRUMENT_STATE
   GAUGES
   EARTH_SUN_MOON_REFERENCE_DATA
*/

(function bindAudreliaShowroomGlobeRender(global) {
  "use strict";

  const VERSION = "AUDRELIA_SHOWROOM_GLOBE_RENDER_TNT_v1";
  const TAU = Math.PI * 2;
  const PI = Math.PI;
  const DEG = Math.PI / 180;
  const SOURCE_WIDTH = 3072;
  const SOURCE_HEIGHT = 1536;
  const MAX_WORK_SIZE = 1120;
  const BODY_SET = new Set(["audrelia", "audrelia-sun", "solar-system-sun"]);
  const textureCache = Object.create(null);

  const PROFILES = Object.freeze({
    "audrelia": Object.freeze({
      body: "audrelia",
      label: "Audrelia",
      axialTiltDeg: -18.5,
      seed: 63501,
      rimColor: "rgba(154,224,255,0.78)",
      glowColor: "rgba(90,190,255,0.38)",
      type: "planet"
    }),
    "audrelia-sun": Object.freeze({
      body: "audrelia-sun",
      label: "Audrelia’s Sun",
      axialTiltDeg: -9.0,
      seed: 63502,
      rimColor: "rgba(255,214,132,0.72)",
      glowColor: "rgba(255,156,62,0.38)",
      type: "local-star"
    }),
    "solar-system-sun": Object.freeze({
      body: "solar-system-sun",
      label: "Solar-System Sun",
      axialTiltDeg: -7.25,
      seed: 63503,
      rimColor: "rgba(255,230,128,0.82)",
      glowColor: "rgba(255,164,38,0.46)",
      type: "reference-star"
    })
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value) || 0));
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

  function normalizeBody(value) {
    value = String(value || "").trim().toLowerCase();

    if (value === "audrelia") return "audrelia";
    if (value === "audrelia-sun" || value.includes("audrelia") && value.includes("sun")) return "audrelia-sun";
    if (value === "solar-system-sun" || value === "solar-sun" || value.includes("solar")) return "solar-system-sun";

    if (value === "earth" || value.includes("planet")) return "audrelia";
    if (value === "sun") return "solar-system-sun";

    return "audrelia";
  }

  function getProfile(body) {
    const normalized = normalizeBody(body);
    return PROFILES[normalized] || PROFILES.audrelia;
  }

  function llToXY(lon, lat, width, height) {
    return {
      x: ((lon + 180) / 360) * width,
      y: ((90 - lat) / 180) * height
    };
  }

  function drawLonLatEllipse(ctx, lon, lat, lonRadius, latRadius, rotationDeg, fill, stroke, lineWidth) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const p = llToXY(lon, lat, width, height);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((rotationDeg || 0) * DEG);
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
    if (!points || points.length < 2) return;

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.beginPath();

    points.forEach((point, index) => {
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

  function buildAudreliaTexture(profile) {
    const canvas = makeCanvas(SOURCE_WIDTH, SOURCE_HEIGHT);
    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    const random = makeSeededRandom(profile.seed);

    const ocean = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);
    ocean.addColorStop(0.00, "#152f5f");
    ocean.addColorStop(0.22, "#0d5f92");
    ocean.addColorStop(0.42, "#0f789b");
    ocean.addColorStop(0.62, "#124c7d");
    ocean.addColorStop(0.82, "#0b2e59");
    ocean.addColorStop(1.00, "#061936");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    for (let i = 0; i < 1700; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -74 + random() * 148;
      const rx = 0.7 + random() * 7;
      const ry = 0.25 + random() * 2.8;
      const alpha = 0.018 + random() * 0.075;

      drawLonLatEllipse(
        ctx,
        lon,
        lat,
        rx,
        ry,
        random() * 180,
        "rgba(145,226,255," + alpha.toFixed(4) + ")"
      );
    }

    const landColors = [
      "rgba(72,112,85,0.92)",
      "rgba(105,115,91,0.90)",
      "rgba(132,118,102,0.88)",
      "rgba(168,155,130,0.86)"
    ];

    for (let i = 0; i < 42; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -58 + random() * 116;
      const rx = 8 + random() * 32;
      const ry = 3 + random() * 15;
      const rot = random() * 180;
      const color = landColors[Math.floor(random() * landColors.length)];

      drawLonLatEllipse(ctx, lon, lat, rx, ry, rot, color, "rgba(255,255,220,0.055)", 1);
    }

    for (let i = 0; i < 52; i += 1) {
      const lon = -180 + random() * 360;
      const lat = -65 + random() * 130;
      const points = [];
      const len = 14 + random() * 38;
      const base = random() * 360;

      for (let p = 0; p < 12; p += 1) {
        const t = p / 11;
        points.push([
          lon + Math.cos(base * DEG) * len * (t - 0.5) + Math.sin(t * TAU) * 2.2,
          lat + Math.sin(base * DEG) * len * (t - 0.5) + Math.cos(t * TAU) * 1.3
        ]);
      }

      drawSoftStroke(ctx, points, random() > 0.5 ? "rgba(232,236,242,0.18)" : "rgba(218,174,82,0.16)", 2.2);
    }

    for (let i = 0; i < 520; i += 1) {
      drawLonLatEllipse(
        ctx,
        -180 + random() * 360,
        -68 + random() * 136,
        0.4 + random() * 2.6,
        0.18 + random() * 1.2,
        random() * 180,
        random() > 0.5
          ? "rgba(255,255,255," + (0.025 + random() * 0.07).toFixed(4) + ")"
          : "rgba(16,22,30," + (0.02 + random() * 0.06).toFixed(4) + ")"
      );
    }

    for (let band = -55; band <= 55; band += 14) {
      const points = [];

      for (let lon = -180; lon <= 180; lon += 3) {
        const wobble =
          Math.sin((lon + band * 2.7) * 0.082) * 3.6 +
          Math.sin((lon - band * 1.3) * 0.15) * 1.5;
        points.push([lon, band + wobble]);
      }

      drawSoftStroke(ctx, points, "rgba(255,255,255,0.095)", 3);
    }

    for (let i = 0; i < 760; i += 1) {
      drawLonLatEllipse(
        ctx,
        -180 + random() * 360,
        -62 + random() * 124,
        1 + random() * 10,
        0.35 + random() * 2.2,
        random() * 180,
        "rgba(255,255,255," + (0.025 + random() * 0.11).toFixed(4) + ")"
      );
    }

    const polarNorth = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT * 0.22);
    polarNorth.addColorStop(0, "rgba(245,250,255,0.30)");
    polarNorth.addColorStop(1, "rgba(245,250,255,0)");
    ctx.fillStyle = polarNorth;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT * 0.22);

    const polarSouth = ctx.createLinearGradient(0, SOURCE_HEIGHT, 0, SOURCE_HEIGHT * 0.78);
    polarSouth.addColorStop(0, "rgba(245,250,255,0.28)");
    polarSouth.addColorStop(1, "rgba(245,250,255,0)");
    ctx.fillStyle = polarSouth;
    ctx.fillRect(0, SOURCE_HEIGHT * 0.78, SOURCE_WIDTH, SOURCE_HEIGHT * 0.22);

    return ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
  }

  function buildStarTexture(profile) {
    const canvas = makeCanvas(SOURCE_WIDTH, SOURCE_HEIGHT);
    const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    const random = makeSeededRandom(profile.seed);

    const local = profile.body === "audrelia-sun";

    const base = ctx.createLinearGradient(0, 0, 0, SOURCE_HEIGHT);

    if (local) {
      base.addColorStop(0.00, "#ffe6a0");
      base.addColorStop(0.20, "#ffc46f");
      base.addColorStop(0.45, "#f7953d");
      base.addColorStop(0.70, "#d65a22");
      base.addColorStop(1.00, "#7f230e");
    } else {
      base.addColorStop(0.00, "#fff0a8");
      base.addColorStop(0.20, "#ffd867");
      base.addColorStop(0.45, "#ffa52f");
      base.addColorStop(0.72, "#e35d16");
      base.addColorStop(1.00, "#8a2608");
    }

    ctx.fillStyle = base;
    ctx.fillRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    ctx.globalCompositeOperation = "screen";

    const grains = local ? 6200 : 8200;

    for (let i = 0; i < grains; i += 1) {
      const x = random() * SOURCE_WIDTH;
      const y = random() * SOURCE_HEIGHT;
      const rx = 2 + random() * (local ? 12 : 15);
      const ry = 1 + random() * (local ? 5 : 6.5);
      const alpha = 0.022 + random() * (local ? 0.095 : 0.12);

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

    ctx.globalCompositeOperation = "source-over";

    for (let row = -66; row <= 66; row += local ? 12 : 10) {
      const points = [];

      for (let lon = -180; lon <= 180; lon += 3) {
        const wave =
          Math.sin((lon + row * 1.7) * 0.105) * (local ? 3.0 : 3.8) +
          Math.sin((lon - row * 2.1) * 0.045) * (local ? 1.7 : 2.4);
        points.push([lon, row + wave]);
      }

      drawSoftStroke(ctx, points, local ? "rgba(255,230,190,0.105)" : "rgba(255,244,195,0.12)", local ? 2.4 : 3);
    }

    return ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
  }

  function getTexture(body) {
    body = normalizeBody(body);

    if (textureCache[body]) return textureCache[body];

    const profile = getProfile(body);
    const imageData = profile.type === "planet" ? buildAudreliaTexture(profile) : buildStarTexture(profile);

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

    const x = ((u % 1 + 1) % 1) * width;
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

  function drawSphere(ctx, targetWidth, targetHeight, body, longitudeTurns, zoomPercent) {
    body = normalizeBody(body);

    const profile = getProfile(body);
    const texture = getTexture(body);
    const workSize = Math.min(MAX_WORK_SIZE, Math.max(360, Math.min(targetWidth, targetHeight)));
    const work = makeCanvas(workSize, workSize);
    const workCtx = work.getContext("2d", { alpha: true, willReadFrequently: true });
    const image = workCtx.createImageData(workSize, workSize);
    const pixels = image.data;

    const radius = workSize * 0.46;
    const center = workSize / 2;
    const radius2 = radius * radius;
    const tilt = profile.axialTiltDeg * DEG;
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
    const hMag = Math.sqrt(hx0 * hx0 + hy0 * hy0 + hz0 * hz0);
    const hx = hx0 / hMag;
    const hy = hy0 / hMag;
    const hz = hz0 / hMag;

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

        const u = ((lon / TAU + 0.5) % 1 + 1) % 1;
        const v = 0.5 - lat / PI;

        sampleTexture(texture, u, v, color);

        const nDotL = clamp(sx * lx + sy * ly + sz * lz, 0, 1);
        const nDotH = clamp(sx * hx + sy * hy + sz * hz, 0, 1);
        const dist = Math.sqrt(d2) / radius;
        const rim = smoothstep(0.68, 1.0, dist);

        let baseLight = profile.type === "planet" ? 0.31 + nDotL * 0.76 : 0.82 + nDotL * 0.18;

        let r = color[0] * baseLight;
        let g = color[1] * baseLight;
        let b = color[2] * baseLight;

        if (profile.type === "planet") {
          const waterish = color[2] > color[1] + 8 && color[2] > color[0] + 14;
          const spec = waterish ? Math.pow(nDotH, 48) * 0.35 : Math.pow(nDotH, 80) * 0.05;
          const atmosphere = rim * 30;

          r += spec * 110 + atmosphere * 0.45;
          g += spec * 145 + atmosphere * 1.0;
          b += spec * 210 + atmosphere * 1.65;
        } else {
          const internalGlow = profile.body === "solar-system-sun" ? 22 + rim * 32 : 16 + rim * 24;
          r += internalGlow;
          g += internalGlow * 0.72;
          b += internalGlow * 0.24;
        }

        const edgeAlpha = clamp((1 - dist) / 0.018, 0, 1);

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

    const zoom = clamp(zoomPercent || 100, 70, 240) / 100;
    const drawSize = Math.min(targetWidth, targetHeight) * 0.92 * zoom;
    const dx = (targetWidth - drawSize) / 2;
    const dy = (targetHeight - drawSize) / 2;
    const cx = targetWidth / 2;
    const cy = targetHeight / 2;
    const rOuter = drawSize / 2;

    ctx.drawImage(work, dx, dy, drawSize, drawSize);

    if (profile.type !== "planet") {
      ctx.save();
      const corona = ctx.createRadialGradient(cx, cy, rOuter * 0.82, cx, cy, rOuter * 1.24);
      corona.addColorStop(0.00, profile.body === "solar-system-sun" ? "rgba(255,226,110,0.20)" : "rgba(255,214,128,0.15)");
      corona.addColorStop(0.58, profile.body === "solar-system-sun" ? "rgba(255,128,26,0.15)" : "rgba(255,118,42,0.10)");
      corona.addColorStop(1.00, "rgba(255,128,26,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter * 1.24, 0, TAU);
      ctx.fillStyle = corona;
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, rOuter * 1.008, 0, TAU);
    ctx.strokeStyle = profile.rimColor;
    ctx.lineWidth = Math.max(2, rOuter * 0.012);
    ctx.shadowColor = profile.glowColor;
    ctx.shadowBlur = rOuter * 0.09;
    ctx.stroke();
    ctx.restore();

    return {
      ok: true,
      version: VERSION,
      body,
      label: profile.label,
      planetName: "Audrelia",
      universe: "nine-summits-universe",
      activeBodies: ["audrelia", "audrelia-sun", "solar-system-sun"],
      referenceBodies: ["earth", "earth-sun", "earth-moon"],
      projection: "audrelia-orthographic-sphere",
      rendererOwnsBodiesOnly: true,
      generatedImage: false,
      fantasyMode: false,
      visualPassClaimed: false
    };
  }

  function resizeCanvas(canvas) {
    const parent = canvas.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
    const cssSize = clamp(Math.round(rect.width || canvas.clientWidth || 420), 260, 1500);
    const dpr = clamp(global.devicePixelRatio || 1, 1, 3);
    const pixelSize = Math.round(cssSize * dpr);

    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

    if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
      canvas.width = pixelSize;
      canvas.height = pixelSize;
    }
  }

  function createRenderer(canvas, initialOptions) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("AUDRELIA_SHOWROOM_GLOBE_RENDER_TNT_v1 requires a canvas.");
    }

    let currentOptions = Object.assign({}, initialOptions || {});
    const ctx = canvas.getContext("2d", { alpha: true });

    function render(nextOptions) {
      currentOptions = Object.assign({}, currentOptions, nextOptions || {});
      resizeCanvas(canvas);

      const body = normalizeBody(currentOptions.body || currentOptions.activeBody);
      const longitude = Number(currentOptions.longitude) || 0;
      const zoom = clamp(Number(currentOptions.zoom) || 100, 70, 240);

      canvas.dataset.body = body;
      canvas.dataset.planetName = "Audrelia";
      canvas.dataset.universe = "nine-summits-universe";
      canvas.dataset.renderVersion = VERSION;
      canvas.dataset.rendererOwnsBodiesOnly = "true";
      canvas.dataset.generatedImage = "false";
      canvas.dataset.visualPassClaimed = "false";

      return drawSphere(ctx, canvas.width, canvas.height, body, longitude, zoom);
    }

    function resize() {
      resizeCanvas(canvas);
      return render(currentOptions);
    }

    resizeCanvas(canvas);

    return {
      VERSION,
      version: VERSION,
      render,
      resize,
      getStatus() {
        const body = normalizeBody(currentOptions.body || currentOptions.activeBody);
        const profile = getProfile(body);

        return {
          ok: true,
          version: VERSION,
          role: "render-authority-only",
          activeBody: body,
          label: profile.label,
          planetName: "Audrelia",
          universe: "nine-summits-universe",
          activeBodies: ["audrelia", "audrelia-sun", "solar-system-sun"],
          referenceBodies: ["earth", "earth-sun", "earth-moon"],
          rendererOwnsBodiesOnly: true,
          routeOwnsBodies: false,
          instrumentOwnsState: true,
          generatedImage: false,
          visualPassClaimed: false
        };
      }
    };
  }

  function renderToCanvas(canvas, options) {
    const renderer = createRenderer(canvas, options || {});
    return renderer.render(options || {});
  }

  const api = {
    VERSION,
    version: VERSION,
    PROFILES,
    createRenderer,
    renderToCanvas,
    getStatus() {
      return {
        ok: true,
        version: VERSION,
        role: "render-authority-only",
        planetName: "Audrelia",
        universe: "nine-summits-universe",
        activeBodies: ["audrelia", "audrelia-sun", "solar-system-sun"],
        referenceBodies: ["earth", "earth-sun", "earth-moon"],
        rendererOwnsBodiesOnly: true,
        routeOwnsBodies: false,
        instrumentOwnsState: true,
        generatedImage: false,
        visualPassClaimed: false
      };
    }
  };

  global.DGBShowroomGlobeRender = api;
  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBShowroomGlobeRender = api;
})(typeof window !== "undefined" ? window : globalThis);
