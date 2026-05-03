/* /assets/showroom.globe.render.js
   AUDRELIA_CLIMATE_MOON_RENDER_TNT_v1

   ROLE=
   RENDER_AUTHORITY_ONLY

   PURPOSE=
   Render Audrelia’s manufactured climate moon.
   The moon is modeled after Earth’s Moon, but story-law says it was assembled from space rock
   and engineered to stabilize climatology on Audrelia.

   BOUNDARY=
   Route owns labels/buttons/shell.
   Instrument owns state/motion.
   Render owns pixels only.

   COMPATIBILITY=
   body="moon" maps to body="audrelia-moon" so older route buttons still render the new moon.
*/

(function bindAudreliaClimateMoonRender(global) {
  "use strict";

  const VERSION = "AUDRELIA_CLIMATE_MOON_RENDER_TNT_v1";
  const TAU = Math.PI * 2;
  const PI = Math.PI;
  const DEG = Math.PI / 180;

  const SOURCE_W = 2048;
  const SOURCE_H = 1024;
  const MAX_WORK = 1120;

  const textureCache = Object.create(null);

  const PROFILES = Object.freeze({
    audrelia: {
      body: "audrelia",
      label: "Audrelia",
      type: "planet",
      seed: 60111,
      tilt: -18.5,
      rim: "rgba(150,225,255,0.72)",
      glow: "rgba(86,190,255,0.34)"
    },
    "audrelia-sun": {
      body: "audrelia-sun",
      label: "Audrelia’s Sun",
      type: "star",
      seed: 60112,
      tilt: -9,
      rim: "rgba(255,216,130,0.75)",
      glow: "rgba(255,145,45,0.42)"
    },
    "solar-system-sun": {
      body: "solar-system-sun",
      label: "Solar-System Sun",
      type: "star",
      seed: 60113,
      tilt: -7.25,
      rim: "rgba(255,230,135,0.84)",
      glow: "rgba(255,166,38,0.50)"
    },
    "audrelia-moon": {
      body: "audrelia-moon",
      label: "Audrelia Climate Moon",
      type: "manufactured-moon",
      seed: 60114,
      tilt: -6.8,
      rim: "rgba(230,236,232,0.70)",
      glow: "rgba(170,190,205,0.24)"
    }
  });

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, Number(n) || 0));
  }

  function wrap01(n) {
    n %= 1;
    return n < 0 ? n + 1 : n;
  }

  function smoothstep(a, b, x) {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function randomFactory(seed) {
    let s = seed >>> 0;
    return function rand() {
      s += 0x6D2B79F5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function canvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  }

  function normalizeBody(value) {
    value = String(value || "").trim().toLowerCase();

    if (value === "audrelia") return "audrelia";
    if (value === "audrelia-sun" || (value.includes("audrelia") && value.includes("sun"))) return "audrelia-sun";
    if (value === "solar-system-sun" || value === "solar-sun" || value.includes("solar")) return "solar-system-sun";

    if (
      value === "moon" ||
      value === "audrelia-moon" ||
      value === "adralia-moon" ||
      value.includes("climate-moon") ||
      value.includes("manufactured-moon")
    ) {
      return "audrelia-moon";
    }

    if (value === "sun") return "solar-system-sun";
    if (value === "earth" || value.includes("planet")) return "audrelia";

    return "audrelia";
  }

  function profileFor(body) {
    return PROFILES[normalizeBody(body)] || PROFILES.audrelia;
  }

  function xyFromLonLat(lon, lat, w, h) {
    return {
      x: ((lon + 180) / 360) * w,
      y: ((90 - lat) / 180) * h
    };
  }

  function ellipseLL(ctx, lon, lat, lonR, latR, rot, fill, stroke, lineWidth) {
    const p = xyFromLonLat(lon, lat, ctx.canvas.width, ctx.canvas.height);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((rot || 0) * DEG);
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      Math.max(0.5, (lonR / 360) * ctx.canvas.width),
      Math.max(0.5, (latR / 180) * ctx.canvas.height),
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

  function strokeLL(ctx, points, stroke, width) {
    if (!points || points.length < 2) return;

    ctx.beginPath();

    points.forEach((pt, i) => {
      const p = xyFromLonLat(pt[0], pt[1], ctx.canvas.width, ctx.canvas.height);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  function buildAudreliaTexture(profile) {
    const c = canvas(SOURCE_W, SOURCE_H);
    const ctx = c.getContext("2d", { alpha: false, willReadFrequently: true });
    const rand = randomFactory(profile.seed);

    const ocean = ctx.createLinearGradient(0, 0, 0, SOURCE_H);
    ocean.addColorStop(0, "#132d5c");
    ocean.addColorStop(0.25, "#0e668f");
    ocean.addColorStop(0.45, "#137b95");
    ocean.addColorStop(0.7, "#0b3f73");
    ocean.addColorStop(1, "#051630");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, SOURCE_W, SOURCE_H);

    for (let i = 0; i < 48; i += 1) {
      ellipseLL(
        ctx,
        -180 + rand() * 360,
        -62 + rand() * 124,
        8 + rand() * 30,
        3 + rand() * 14,
        rand() * 180,
        rand() > 0.45 ? "rgba(76,118,86,0.9)" : "rgba(155,140,105,0.82)",
        "rgba(255,255,220,0.055)",
        1
      );
    }

    for (let band = -56; band <= 56; band += 13) {
      const points = [];
      for (let lon = -180; lon <= 180; lon += 3) {
        const wobble = Math.sin((lon + band * 2.5) * 0.08) * 3.4 + Math.sin(lon * 0.15) * 1.2;
        points.push([lon, band + wobble]);
      }
      strokeLL(ctx, points, "rgba(255,255,255,0.10)", 3);
    }

    for (let i = 0; i < 760; i += 1) {
      ellipseLL(
        ctx,
        -180 + rand() * 360,
        -65 + rand() * 130,
        0.8 + rand() * 9,
        0.25 + rand() * 2.1,
        rand() * 180,
        "rgba(255,255,255," + (0.025 + rand() * 0.10).toFixed(4) + ")"
      );
    }

    return ctx.getImageData(0, 0, SOURCE_W, SOURCE_H);
  }

  function buildStarTexture(profile) {
    const c = canvas(SOURCE_W, SOURCE_H);
    const ctx = c.getContext("2d", { alpha: false, willReadFrequently: true });
    const rand = randomFactory(profile.seed);
    const solar = profile.body === "solar-system-sun";

    const base = ctx.createLinearGradient(0, 0, 0, SOURCE_H);
    base.addColorStop(0, solar ? "#fff1a5" : "#ffe3a0");
    base.addColorStop(0.22, solar ? "#ffd261" : "#ffc06a");
    base.addColorStop(0.5, solar ? "#ff9c2d" : "#f38a37");
    base.addColorStop(0.78, solar ? "#db5414" : "#c94c1e");
    base.addColorStop(1, "#7a1e08");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, SOURCE_W, SOURCE_H);

    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < (solar ? 7600 : 5600); i += 1) {
      const x = rand() * SOURCE_W;
      const y = rand() * SOURCE_H;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rand() * TAU);
      ctx.beginPath();
      ctx.ellipse(0, 0, 2 + rand() * 13, 1 + rand() * 5.5, 0, 0, TAU);
      ctx.fillStyle = rand() > 0.35
        ? "rgba(255,248,190," + (0.025 + rand() * 0.11).toFixed(4) + ")"
        : "rgba(255,112,35," + (0.02 + rand() * 0.08).toFixed(4) + ")";
      ctx.fill();
      ctx.restore();
    }

    ctx.globalCompositeOperation = "source-over";

    for (let row = -64; row <= 64; row += solar ? 10 : 12) {
      const pts = [];
      for (let lon = -180; lon <= 180; lon += 3) {
        const wave = Math.sin((lon + row * 1.7) * 0.105) * 3.2 + Math.sin((lon - row) * 0.045) * 1.8;
        pts.push([lon, row + wave]);
      }
      strokeLL(ctx, pts, solar ? "rgba(255,244,195,0.12)" : "rgba(255,230,190,0.105)", solar ? 3 : 2.4);
    }

    return ctx.getImageData(0, 0, SOURCE_W, SOURCE_H);
  }

  function buildClimateMoonTexture(profile) {
    const c = canvas(SOURCE_W, SOURCE_H);
    const ctx = c.getContext("2d", { alpha: false, willReadFrequently: true });
    const rand = randomFactory(profile.seed);

    const base = ctx.createLinearGradient(0, 0, 0, SOURCE_H);
    base.addColorStop(0, "#deded7");
    base.addColorStop(0.28, "#c8c9c2");
    base.addColorStop(0.58, "#9fa19c");
    base.addColorStop(0.82, "#777d7f");
    base.addColorStop(1, "#555f66");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, SOURCE_W, SOURCE_H);

    const maria = "rgba(58,62,64,0.34)";
    ellipseLL(ctx, -30, 26, 22, 10, -8, maria);
    ellipseLL(ctx, 12, 18, 20, 9, 6, maria);
    ellipseLL(ctx, 42, -6, 25, 11, 10, maria);
    ellipseLL(ctx, -52, -20, 19, 8, -12, maria);
    ellipseLL(ctx, 82, 30, 18, 7, -8, "rgba(70,72,74,0.22)");

    for (let i = 0; i < 2600; i += 1) {
      const lon = -180 + rand() * 360;
      const lat = -82 + rand() * 164;
      const size = 0.22 + Math.pow(rand(), 2.55) * 7.2;
      const strength = 0.12 + rand() * 0.55;

      ellipseLL(
        ctx,
        lon,
        lat,
        size,
        size * 0.66,
        rand() * 180,
        "rgba(34,36,38," + (0.045 + strength * 0.10).toFixed(4) + ")"
      );

      ellipseLL(
        ctx,
        lon - size * 0.05,
        lat - size * 0.05,
        size * 0.76,
        size * 0.50,
        rand() * 180,
        "rgba(255,255,245," + (0.03 + strength * 0.07).toFixed(4) + ")"
      );
    }

    /*
      Manufactured assembly seams:
      not a hard panel seam; these are subtle orbital construction arcs,
      implying space-rock assembly without breaking spherical integrity.
    */
    for (let i = 0; i < 9; i += 1) {
      const lat = -58 + i * 14;
      const pts = [];

      for (let lon = -180; lon <= 180; lon += 3) {
        const wave = Math.sin((lon * 0.055) + i) * 2.2 + Math.sin((lon * 0.12) - i) * 0.9;
        pts.push([lon, lat + wave]);
      }

      strokeLL(ctx, pts, "rgba(205,218,216,0.075)", 1.5);
    }

    /*
      Climate-regulation lattice:
      faint artificial meridian nodes embedded into the lunar surface.
    */
    for (let i = 0; i < 72; i += 1) {
      const lon = -180 + rand() * 360;
      const lat = -64 + rand() * 128;
      const r = 0.35 + rand() * 1.25;

      ellipseLL(ctx, lon, lat, r, r * 0.72, 0, "rgba(210,235,225,0.11)");
      ellipseLL(ctx, lon, lat, r * 0.34, r * 0.25, 0, "rgba(245,255,245,0.10)");
    }

    for (let i = 0; i < 180; i += 1) {
      const lon = -180 + rand() * 360;
      const lat = -72 + rand() * 144;
      ellipseLL(
        ctx,
        lon,
        lat,
        0.12 + rand() * 0.7,
        0.08 + rand() * 0.4,
        rand() * 180,
        rand() > 0.55
          ? "rgba(255,255,255," + (0.025 + rand() * 0.06).toFixed(4) + ")"
          : "rgba(20,24,26," + (0.02 + rand() * 0.05).toFixed(4) + ")"
      );
    }

    return ctx.getImageData(0, 0, SOURCE_W, SOURCE_H);
  }

  function getTexture(body) {
    body = normalizeBody(body);

    if (textureCache[body]) return textureCache[body];

    const profile = profileFor(body);
    const image =
      profile.type === "planet"
        ? buildAudreliaTexture(profile)
        : profile.type === "star"
          ? buildStarTexture(profile)
          : buildClimateMoonTexture(profile);

    textureCache[body] = {
      width: image.width,
      height: image.height,
      data: image.data
    };

    return textureCache[body];
  }

  function sample(texture, u, v, out) {
    const w = texture.width;
    const h = texture.height;
    const data = texture.data;

    const x = wrap01(u) * w;
    const y = clamp(v, 0, 0.999999) * (h - 1);

    const x0 = Math.floor(x) % w;
    const x1 = (x0 + 1) % w;
    const y0 = Math.floor(y);
    const y1 = Math.min(h - 1, y0 + 1);

    const tx = x - Math.floor(x);
    const ty = y - y0;

    const i00 = (y0 * w + x0) * 4;
    const i10 = (y0 * w + x1) * 4;
    const i01 = (y1 * w + x0) * 4;
    const i11 = (y1 * w + x1) * 4;

    const r0 = data[i00] * (1 - tx) + data[i10] * tx;
    const g0 = data[i00 + 1] * (1 - tx) + data[i10 + 1] * tx;
    const b0 = data[i00 + 2] * (1 - tx) + data[i10 + 2] * tx;

    const r1 = data[i01] * (1 - tx) + data[i11] * tx;
    const g1 = data[i01 + 1] * (1 - tx) + data[i11 + 1] * tx;
    const b1 = data[i01 + 2] * (1 - tx) + data[i11 + 2] * tx;

    out[0] = r0 * (1 - ty) + r1 * ty;
    out[1] = g0 * (1 - ty) + g1 * ty;
    out[2] = b0 * (1 - ty) + b1 * ty;
  }

  function resizeCanvas(c) {
    const host = c.parentElement || c;
    const rect = host.getBoundingClientRect();
    const css = clamp(Math.round(rect.width || c.clientWidth || 420), 260, 1500);
    const dpr = clamp(global.devicePixelRatio || 1, 1, 3);
    const px = Math.round(css * dpr);

    c.style.width = css + "px";
    c.style.height = css + "px";

    if (c.width !== px || c.height !== px) {
      c.width = px;
      c.height = px;
    }
  }

  function drawSphere(ctx, w, h, body, longitude, zoom) {
    body = normalizeBody(body);

    const profile = profileFor(body);
    const texture = getTexture(body);
    const workSize = Math.min(MAX_WORK, Math.max(360, Math.min(w, h)));
    const work = canvas(workSize, workSize);
    const wctx = work.getContext("2d", { alpha: true, willReadFrequently: true });
    const img = wctx.createImageData(workSize, workSize);
    const pix = img.data;

    const radius = workSize * 0.46;
    const radius2 = radius * radius;
    const center = workSize / 2;

    const tilt = profile.tilt * DEG;
    const cosTilt = Math.cos(tilt);
    const sinTilt = Math.sin(tilt);
    const centerLon = Number(longitude || 0) * TAU;
    const color = [0, 0, 0];

    const lx0 = -0.44;
    const ly0 = -0.30;
    const lz0 = 0.84;
    const lm = Math.sqrt(lx0 * lx0 + ly0 * ly0 + lz0 * lz0);
    const lx = lx0 / lm;
    const ly = ly0 / lm;
    const lz = lz0 / lm;

    const hx0 = lx;
    const hy0 = ly;
    const hz0 = lz + 1;
    const hm = Math.sqrt(hx0 * hx0 + hy0 * hy0 + hz0 * hz0);
    const hx = hx0 / hm;
    const hy = hy0 / hm;
    const hz = hz0 / hm;

    let ptr = 0;

    for (let py = 0; py < workSize; py += 1) {
      const y = py + 0.5 - center;

      for (let px = 0; px < workSize; px += 1) {
        const x = px + 0.5 - center;
        const d2 = x * x + y * y;

        if (d2 > radius2) {
          pix[ptr] = 0;
          pix[ptr + 1] = 0;
          pix[ptr + 2] = 0;
          pix[ptr + 3] = 0;
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
        const nDotH = clamp(sx * hx + sy * hy + sz * hz, 0, 1);
        const dist = Math.sqrt(d2) / radius;
        const rim = smoothstep(0.68, 1, dist);

        let light = profile.type === "star" ? 0.82 + nDotL * 0.18 : 0.32 + nDotL * 0.75;

        let r = color[0] * light;
        let g = color[1] * light;
        let b = color[2] * light;

        if (profile.type === "planet") {
          const water = color[2] > color[1] + 8 && color[2] > color[0] + 14;
          const spec = water ? Math.pow(nDotH, 48) * 0.32 : Math.pow(nDotH, 80) * 0.04;
          const atm = rim * 30;

          r += spec * 105 + atm * 0.45;
          g += spec * 140 + atm * 1.0;
          b += spec * 205 + atm * 1.65;
        } else if (profile.type === "star") {
          const glow = profile.body === "solar-system-sun" ? 22 + rim * 32 : 16 + rim * 24;
          r += glow;
          g += glow * 0.72;
          b += glow * 0.24;
        } else {
          const spec = Math.pow(nDotH, 70) * 0.08;
          const climateGlow = rim * 9;

          r += climateGlow + spec * 32;
          g += climateGlow * 1.02 + spec * 34;
          b += climateGlow * 1.05 + spec * 36;
        }

        const edge = clamp((1 - dist) / 0.018, 0, 1);

        pix[ptr] = clamp(Math.round(r), 0, 255);
        pix[ptr + 1] = clamp(Math.round(g), 0, 255);
        pix[ptr + 2] = clamp(Math.round(b), 0, 255);
        pix[ptr + 3] = Math.round(edge * 255);
        ptr += 4;
      }
    }

    wctx.putImageData(img, 0, 0);

    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const scale = clamp(Number(zoom || 100), 70, 240) / 100;
    const drawSize = Math.min(w, h) * 0.92 * scale;
    const dx = (w - drawSize) / 2;
    const dy = (h - drawSize) / 2;
    const cx = w / 2;
    const cy = h / 2;
    const ro = drawSize / 2;

    ctx.drawImage(work, dx, dy, drawSize, drawSize);

    if (profile.type === "star") {
      ctx.save();
      const corona = ctx.createRadialGradient(cx, cy, ro * 0.82, cx, cy, ro * 1.24);
      corona.addColorStop(0, "rgba(255,226,110,0.18)");
      corona.addColorStop(0.58, "rgba(255,128,26,0.12)");
      corona.addColorStop(1, "rgba(255,128,26,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, ro * 1.24, 0, TAU);
      ctx.fillStyle = corona;
      ctx.fill();
      ctx.restore();
    }

    if (profile.type === "manufactured-moon") {
      ctx.save();
      const halo = ctx.createRadialGradient(cx, cy, ro * 0.72, cx, cy, ro * 1.18);
      halo.addColorStop(0, "rgba(160,190,190,0)");
      halo.addColorStop(0.65, "rgba(160,210,195,0.055)");
      halo.addColorStop(1, "rgba(160,210,195,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, ro * 1.18, 0, TAU);
      ctx.fillStyle = halo;
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, ro * 1.008, 0, TAU);
    ctx.strokeStyle = profile.rim;
    ctx.lineWidth = Math.max(2, ro * 0.012);
    ctx.shadowColor = profile.glow;
    ctx.shadowBlur = ro * 0.09;
    ctx.stroke();
    ctx.restore();

    return {
      ok: true,
      version: VERSION,
      body,
      label: profile.label,
      planetName: "Audrelia",
      moonType: body === "audrelia-moon" ? "manufactured-climate-moon" : null,
      rendererOwnsBodiesOnly: true,
      generatedImage: false,
      visualPassClaimed: false
    };
  }

  function createRenderer(target, initialOptions) {
    if (!(target instanceof HTMLCanvasElement)) {
      throw new Error("AUDRELIA_CLIMATE_MOON_RENDER_TNT_v1 requires a canvas target.");
    }

    const ctx = target.getContext("2d", { alpha: true });
    let options = Object.assign({}, initialOptions || {});

    function render(nextOptions) {
      options = Object.assign({}, options, nextOptions || {});
      resizeCanvas(target);

      const body = normalizeBody(options.body || options.activeBody || target.dataset.body);
      const longitude = Number(options.longitude) || 0;
      const zoom = clamp(Number(options.zoom) || 100, 70, 240);

      target.dataset.body = body;
      target.dataset.renderVersion = VERSION;
      target.dataset.planetName = "Audrelia";
      target.dataset.renderAuthority = "/assets/showroom.globe.render.js";
      target.dataset.generatedImage = "false";
      target.dataset.visualPassClaimed = "false";

      return drawSphere(ctx, target.width, target.height, body, longitude, zoom);
    }

    function resize() {
      resizeCanvas(target);
      return render(options);
    }

    resizeCanvas(target);

    return {
      VERSION,
      version: VERSION,
      render,
      resize,
      getStatus() {
        const body = normalizeBody(options.body || options.activeBody || target.dataset.body);
        return {
          ok: true,
          version: VERSION,
          activeBody: body,
          planetName: "Audrelia",
          audreliaClimateMoonSupported: true,
          moonMapsToAudreliaClimateMoon: true,
          rendererOwnsBodiesOnly: true,
          generatedImage: false,
          visualPassClaimed: false
        };
      }
    };
  }

  function renderToCanvas(target, options) {
    const renderer = createRenderer(target, options || {});
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
        activeBodies: ["audrelia", "audrelia-sun", "solar-system-sun", "audrelia-moon"],
        compatibility: {
          moon: "audrelia-moon",
          earth: "audrelia",
          sun: "solar-system-sun"
        },
        audreliaClimateMoonSupported: true,
        rendererOwnsBodiesOnly: true,
        generatedImage: false,
        visualPassClaimed: false
      };
    }
  };

  global.DGBShowroomGlobeRender = api;
  global.DiamondGateBridge = global.DiamondGateBridge || {};
  global.DiamondGateBridge.DGBShowroomGlobeRender = api;
})(typeof window !== "undefined" ? window : globalThis);
