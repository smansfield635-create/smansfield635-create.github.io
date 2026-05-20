// /assets/audralia/clean/audralia.engine.js
// AUDRALIA_G2_NINE_SUMMITS_PLANET_FORM_ENGINE_TNT_v1
// Full-file replacement.
// Purpose: keep the successful Audralia route-bridge mount contract, then upgrade the visible body from standby/diagnostic form to a stronger Nine-Summits-style planet render.
// Owns: visible clean-canvas Audralia planet form handoff.
// Does not own: parent Globe route, route bridge HTML, global navigation, character page, gauges logic, or downstream child-module split.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_NINE_SUMMITS_PLANET_FORM_ENGINE_TNT_v1";
  const RECEIPT = "AUDRALIA_G2_NINE_SUMMITS_PLANET_FORM_ENGINE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_CLEAN_CANVAS_ENGINE_MOUNT_CONTRACT_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const VERSION = "2026-05-20.audralia-g2-nine-summits-planet-form-engine-v1";

  const PLANET = Object.freeze({
    seed: 25645161,
    nodeCount: 256,
    summitCount: 9,
    sectorCount: 16,
    regionCount: 4,
    light: Object.freeze({ x: -0.62, y: -0.48, z: 0.62 }),
    atmosphere: Object.freeze({
      rimStrength: 0.78,
      hazeStrength: 0.34,
      cloudStrength: 0.28
    })
  });

  const state = {
    mounted: false,
    mountedAt: null,
    mountCount: 0,
    lastCanvas: null,
    lastRoot: null,
    lastMount: null,
    lastReceipt: null,
    lastSize: 0
  };

  function win() {
    return typeof window !== "undefined" ? window : {};
  }

  function doc(context) {
    return context?.document || (typeof document !== "undefined" ? document : null);
  }

  function now() {
    return new Date().toISOString();
  }

  function isElement(value) {
    const ElementCtor = win().Element;
    return Boolean(ElementCtor && value instanceof ElementCtor);
  }

  function resolveMount(input) {
    if (isElement(input)) return input;

    if (isElement(input?.mount)) return input.mount;
    if (isElement(input?.mountTarget)) return input.mountTarget;
    if (isElement(input?.target)) return input.target;

    const documentRef = doc(input);

    return (
      documentRef?.getElementById?.("audralia-clean-canvas-mount") ||
      documentRef?.querySelector?.("[data-audralia-clean-canvas-mount]") ||
      null
    );
  }

  function makeEl(documentRef, tag, className, attrs = {}) {
    const el = documentRef.createElement(tag);
    if (className) el.className = className;

    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, String(value));
    }

    return el;
  }

  function styleRoot(root) {
    root.style.cssText = `
      width:100%;
      min-height:27rem;
      display:grid;
      place-items:center;
      position:relative;
      isolation:isolate;
      overflow:hidden;
      border-radius:1.25rem;
      background:
        radial-gradient(circle at 50% 34%,rgba(143,240,195,.18),transparent 16rem),
        radial-gradient(circle at 50% 58%,rgba(36,120,255,.12),transparent 24rem),
        radial-gradient(circle at 50% 80%,rgba(243,200,111,.06),transparent 26rem),
        linear-gradient(180deg,rgba(1,7,16,.28),rgba(1,4,12,.76));
    `;
  }

  function styleCanvas(canvas) {
    canvas.style.cssText = `
      width:min(82vw,31rem);
      height:min(82vw,31rem);
      max-width:100%;
      display:block;
      border-radius:50%;
      filter:
        drop-shadow(0 0 2.8rem rgba(143,240,195,.22))
        drop-shadow(0 0 1.4rem rgba(141,216,255,.10))
        drop-shadow(0 2rem 2.6rem rgba(0,0,0,.46));
      touch-action:none;
    `;
  }

  function styleLabel(label) {
    label.style.cssText = `
      position:absolute;
      left:50%;
      bottom:7%;
      transform:translateX(-50%);
      width:min(88%,25rem);
      padding:.78rem .9rem;
      border:1px solid rgba(143,240,195,.28);
      border-radius:1rem;
      background:rgba(1,7,16,.78);
      color:rgba(255,244,216,.94);
      font:850 .72rem/1.35 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      letter-spacing:.075em;
      text-align:center;
      text-transform:uppercase;
      backdrop-filter:blur(8px);
      z-index:5;
      pointer-events:none;
    `;
  }

  function hash2(x, y, seed = PLANET.seed) {
    let n = Math.imul(x ^ seed, 374761393) ^ Math.imul(y + seed, 668265263);
    n = (n ^ (n >>> 13)) >>> 0;
    n = Math.imul(n, 1274126177) >>> 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function valueNoise(x, y, scale, seedOffset = 0) {
    const sx = x * scale;
    const sy = y * scale;
    const x0 = Math.floor(sx);
    const y0 = Math.floor(sy);
    const tx = fade(sx - x0);
    const ty = fade(sy - y0);

    const a = hash2(x0, y0, PLANET.seed + seedOffset);
    const b = hash2(x0 + 1, y0, PLANET.seed + seedOffset);
    const c = hash2(x0, y0 + 1, PLANET.seed + seedOffset);
    const d = hash2(x0 + 1, y0 + 1, PLANET.seed + seedOffset);

    return lerp(lerp(a, b, tx), lerp(c, d, tx), ty);
  }

  function fbm(x, y, baseScale, octaves, seedOffset = 0) {
    let total = 0;
    let amp = 0.5;
    let scale = baseScale;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise(x, y, scale, seedOffset + i * 997) * amp;
      norm += amp;
      amp *= 0.5;
      scale *= 2.03;
    }

    return total / Math.max(0.0001, norm);
  }

  function normalize3(v) {
    const m = Math.hypot(v.x, v.y, v.z) || 1;
    return { x: v.x / m, y: v.y / m, z: v.z / m };
  }

  function dot3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp01((x - edge0) / Math.max(0.00001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function mixColor(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t)),
      lerp(a[3], b[3], t)
    ];
  }

  function rgba(c) {
    return `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
  }

  function addSummitField(nx, ny, nz) {
    const summitSeeds = [
      [-0.52, -0.35, 0.72],
      [-0.25, -0.54, 0.76],
      [0.08, -0.45, 0.84],
      [0.38, -0.24, 0.80],
      [0.55, 0.02, 0.72],
      [0.34, 0.34, 0.74],
      [0.02, 0.50, 0.80],
      [-0.34, 0.30, 0.78],
      [-0.58, 0.02, 0.70]
    ];

    let field = 0;

    for (let i = 0; i < summitSeeds.length; i += 1) {
      const s = normalize3({ x: summitSeeds[i][0], y: summitSeeds[i][1], z: summitSeeds[i][2] });
      const alignment = Math.max(0, nx * s.x + ny * s.y + nz * s.z);
      field += Math.pow(alignment, 34) * (1.05 + (i % 3) * 0.11);
    }

    return clamp01(field);
  }

  function classifySurface(nx, ny, nz) {
    const lon = Math.atan2(nx, nz);
    const lat = Math.asin(ny);
    const u = lon / Math.PI;
    const v = lat / (Math.PI / 2);

    const broad = fbm(u + 1.72, v + 2.36, 2.15, 5, 100);
    const coast = fbm(u + 4.1, v - 1.7, 5.65, 5, 600);
    const detail = fbm(u - 3.5, v + 5.2, 13.5, 4, 1200);
    const grain = fbm(u + 8.0, v - 7.0, 31.0, 3, 1800);

    const continents =
      broad * 0.54 +
      coast * 0.32 +
      detail * 0.11 +
      grain * 0.03;

    const summit = addSummitField(nx, ny, nz);
    const polar = Math.pow(Math.abs(ny), 4.4);
    const elevation = clamp01((continents - 0.49) * 2.4 + summit * 0.62 + detail * 0.16);
    const land = continents + summit * 0.18 > 0.515;
    const shelf = smoothstep(0.47, 0.56, continents);
    const mountain = land ? clamp01(summit * 1.35 + smoothstep(0.64, 0.86, elevation) * 0.7) : 0;
    const basin = land ? clamp01((1 - elevation) * smoothstep(0.52, 0.62, continents)) : 0;
    const ice = smoothstep(0.80, 0.98, Math.abs(ny)) * (0.50 + detail * 0.5);

    return {
      lon,
      lat,
      u,
      v,
      broad,
      coast,
      detail,
      grain,
      continents,
      land,
      shelf,
      elevation,
      summit,
      mountain,
      basin,
      ice,
      polar
    };
  }

  function drawPlanetPixels(canvas) {
    const rect = canvas.getBoundingClientRect();
    const cssSize = Math.max(300, Math.min(rect.width || 460, 620));
    const dpr = Math.max(1, Math.min(2.5, win().devicePixelRatio || 1));
    const size = Math.round(cssSize * dpr);

    if (canvas.width !== size || canvas.height !== size) {
      canvas.width = size;
      canvas.height = size;
      state.lastSize = size;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return false;

    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.432;
    const light = normalize3(PLANET.light);

    const image = ctx.createImageData(size, size);
    const data = image.data;

    const oceanDeep = [3, 20, 36, 1];
    const oceanMid = [9, 78, 88, 1];
    const oceanShelf = [39, 151, 139, 1];
    const coastSand = [172, 158, 103, 1];
    const landLow = [88, 130, 84, 1];
    const landMid = [105, 145, 91, 1];
    const highland = [142, 142, 102, 1];
    const summitColor = [215, 211, 177, 1];
    const iceColor = [218, 245, 239, 1];
    const nightBlue = [1, 7, 17, 1];

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const dx = (x + 0.5 - cx) / r;
        const dy = (y + 0.5 - cy) / r;
        const rr = dx * dx + dy * dy;
        const idx = (y * size + x) * 4;

        if (rr > 1) {
          data[idx + 3] = 0;
          continue;
        }

        const z = Math.sqrt(Math.max(0, 1 - rr));
        const nx = dx;
        const ny = -dy;
        const nz = z;

        const surface = classifySurface(nx, ny, nz);
        let color;

        if (surface.land) {
          const relief = clamp01(surface.elevation * 0.72 + surface.mountain * 0.38);
          const coastBlend = smoothstep(0.50, 0.57, surface.continents);

          color = mixColor(coastSand, landLow, coastBlend);
          color = mixColor(color, landMid, clamp01(relief * 0.58));
          color = mixColor(color, highland, clamp01(surface.mountain * 0.55));
          color = mixColor(color, summitColor, clamp01(surface.mountain * 0.52 + surface.ice * 0.28));

          const basinTint = [54, 112, 91, 1];
          color = mixColor(color, basinTint, clamp01(surface.basin * 0.20));
        } else {
          const depth = clamp01((0.53 - surface.continents) * 3.2);
          color = mixColor(oceanShelf, oceanMid, depth);
          color = mixColor(color, oceanDeep, clamp01(depth * 0.82));
          color = mixColor(color, oceanShelf, clamp01(surface.shelf * 0.34));
        }

        if (surface.ice > 0.34) {
          color = mixColor(color, iceColor, clamp01((surface.ice - 0.24) * 0.52));
        }

        const normal = normalize3({
          x: nx + (surface.detail - 0.5) * 0.035,
          y: ny + (surface.grain - 0.5) * 0.028,
          z: nz
        });

        const lightAmount = clamp01(dot3(normal, light) * 0.72 + 0.36);
        const terminator = smoothstep(-0.18, 0.78, dot3(normal, light));
        const limb = Math.pow(clamp01(1 - rr), 0.32);
        const edgeDark = smoothstep(0.98, 0.35, rr);
        const atmosphericLift = Math.pow(clamp01(rr), 2.7) * PLANET.atmosphere.hazeStrength;

        let lit = lightAmount * (0.58 + terminator * 0.56);
        lit *= 0.76 + limb * 0.32;
        lit *= 0.78 + edgeDark * 0.28;

        color = mixColor(nightBlue, color, clamp01(lit));
        color = mixColor(color, [126, 232, 202, 1], atmosphericLift * 0.20);

        const cloud = computeCloud(surface.u, surface.v, nx, ny, nz);
        if (cloud > 0.52) {
          const cloudAlpha = clamp01((cloud - 0.52) * 0.46) * PLANET.atmosphere.cloudStrength;
          color = mixColor(color, [235, 248, 235, 1], cloudAlpha);
        }

        const haze = Math.pow(clamp01(rr), 5.4) * 0.22;
        color = mixColor(color, [125, 220, 205, 1], haze);

        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
        data[idx + 3] = Math.round(255 * clamp01(0.98 + haze * 0.08));
      }
    }

    ctx.putImageData(image, 0, 0);

    drawAtmosphericRim(ctx, cx, cy, r, size);
    drawSummitSignals(ctx, cx, cy, r, light);
    drawSubtleOrbitReceipt(ctx, cx, cy, r, size);

    return true;
  }

  function computeCloud(u, v, nx, ny, nz) {
    const beltA = 1 - Math.abs(v - 0.16) * 5.2;
    const beltB = 1 - Math.abs(v + 0.30) * 4.6;
    const streak = fbm(u * 1.4 + 2.2, v * 0.82 - 0.5, 9.5, 4, 2600);
    const fine = fbm(u - 8.3, v + 3.8, 22.0, 3, 3200);

    return clamp01(
      Math.max(beltA, beltB) * 0.52 +
      streak * 0.34 +
      fine * 0.14 -
      Math.abs(nx) * 0.08 +
      nz * 0.06
    );
  }

  function drawAtmosphericRim(ctx, cx, cy, r, size) {
    const rim = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, r * 1.12);
    rim.addColorStop(0, "rgba(143,240,195,0)");
    rim.addColorStop(0.66, "rgba(143,240,195,0.06)");
    rim.addColorStop(0.88, "rgba(141,216,255,0.16)");
    rim.addColorStop(1, "rgba(143,240,195,0)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
    ctx.fillStyle = rim;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.004, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(208,255,236,0.22)";
    ctx.lineWidth = Math.max(1, size * 0.0032);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.034, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(141,216,255,0.12)";
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();
    ctx.restore();
  }

  function drawSummitSignals(ctx, cx, cy, r, light) {
    const summitPoints = [
      [-0.52, -0.35, 0.72],
      [-0.25, -0.54, 0.76],
      [0.08, -0.45, 0.84],
      [0.38, -0.24, 0.80],
      [0.55, 0.02, 0.72],
      [0.34, 0.34, 0.74],
      [0.02, 0.50, 0.80],
      [-0.34, 0.30, 0.78],
      [-0.58, 0.02, 0.70]
    ];

    ctx.save();

    summitPoints.forEach((raw, index) => {
      const s = normalize3({ x: raw[0], y: raw[1], z: raw[2] });

      if (s.z < 0.10) return;

      const lightAmount = clamp01(dot3(s, light) * 0.60 + 0.46);
      const px = cx + s.x * r;
      const py = cy - s.y * r;
      const radius = r * (0.010 + (index % 3) * 0.002);

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,244,216,${0.10 + lightAmount * 0.16})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(px, py, radius * 2.9, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(243,200,111,${0.06 + lightAmount * 0.08})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawSubtleOrbitReceipt(ctx, cx, cy, r, size) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.18);

    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.30, r * 0.36, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(143,240,195,0.075)";
    ctx.lineWidth = Math.max(1, size * 0.002);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.18, r * 0.29, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(243,200,111,0.045)";
    ctx.lineWidth = Math.max(1, size * 0.0015);
    ctx.stroke();

    ctx.restore();
  }

  function createRender(context) {
    const documentRef = doc(context);
    if (!documentRef) throw new Error("Document unavailable for Audralia engine render.");

    const root = makeEl(documentRef, "section", "audralia-engine-root", {
      "data-audralia-engine-render": "true",
      "data-audralia-clean-canvas-render": "true",
      "data-audralia-g2-nine-summits-planet-form": "true",
      "data-contract": CONTRACT,
      "data-previous-contract": PREVIOUS_CONTRACT
    });

    styleRoot(root);

    const canvas = makeEl(documentRef, "canvas", "audralia-engine-canvas", {
      "data-audralia-form": "g2-nine-summits-engine-canvas",
      "aria-label": "Audralia G2 Nine-Summits clean-canvas planet form"
    });

    styleCanvas(canvas);

    const label = makeEl(documentRef, "div", "audralia-engine-label");
    styleLabel(label);
    label.textContent = "Audralia G2 · Nine-Summits planet form mounted";

    root.appendChild(canvas);
    root.appendChild(label);

    return { root, canvas, label };
  }

  function requestDraw(canvas) {
    const draw = () => drawPlanetPixels(canvas);

    if (typeof win().requestAnimationFrame === "function") {
      win().requestAnimationFrame(draw);
    } else {
      setTimeout(draw, 0);
    }
  }

  function installResizeRedraw(root, canvas) {
    if (!root || !canvas) return;

    if (typeof win().ResizeObserver === "function") {
      const observer = new (win().ResizeObserver)(() => requestDraw(canvas));
      observer.observe(root);
      return;
    }

    win().addEventListener?.("resize", () => requestDraw(canvas), { passive: true });
  }

  function mount(input) {
    const mountTarget = resolveMount(input);
    const documentRef = doc(input);

    if (!mountTarget) {
      throw new Error("Audralia G2 engine mount target missing.");
    }

    if (!documentRef) {
      throw new Error("Audralia G2 engine document missing.");
    }

    const render = createRender(input);

    mountTarget.replaceChildren(render.root);

    requestDraw(render.canvas);

    state.mounted = true;
    state.mountedAt = now();
    state.mountCount += 1;
    state.lastCanvas = render.canvas;
    state.lastRoot = render.root;
    state.lastMount = mountTarget;

    mountTarget.dataset.audraliaFormVisible = "true";
    mountTarget.dataset.audraliaEngineMounted = "true";
    mountTarget.dataset.audraliaEngineContract = CONTRACT;
    mountTarget.dataset.audraliaG2NineSummitsPlanetForm = "true";

    const statusTarget = input?.statusTarget;
    if (isElement(statusTarget)) {
      statusTarget.textContent = "FORM_VISIBLE · Audralia G2 Nine-Summits planet form mounted.";
      statusTarget.dataset.state = "pass";
    }

    state.lastReceipt = buildReceipt(true);

    installResizeRedraw(render.root, render.canvas);

    return {
      element: render.root,
      canvas: render.canvas,
      contract: CONTRACT,
      receipt: state.lastReceipt
    };
  }

  function buildReceipt(valid) {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      route: ROUTE,
      valid,
      mounted: state.mounted,
      mountedAt: state.mountedAt,
      mountCount: state.mountCount,
      planetStandard: "G2 Nine-Summits clean-canvas planet form",
      nodeCount: PLANET.nodeCount,
      summitCount: PLANET.summitCount,
      sectorCount: PLANET.sectorCount,
      regionCount: PLANET.regionCount,
      ownsVisibleFormHandoff: true,
      ownsParentGlobeRoute: false,
      ownsRouteBridgeHtml: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      route: ROUTE,
      mounted: state.mounted,
      mountedAt: state.mountedAt,
      mountCount: state.mountCount,
      lastReceipt: state.lastReceipt,
      lastSize: state.lastSize,
      planet: PLANET,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const AUDRALIA_ENGINE = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    route: ROUTE,
    planet: PLANET,
    mount,
    render: mount,
    start: mount,
    boot: mount,
    init: mount,
    create: mount,
    getStatus
  });

  const global = win();

  global.AUDRALIA_ENGINE = AUDRALIA_ENGINE;
  global.AUDRALIA_CLEAN_CANVAS_ENGINE = AUDRALIA_ENGINE;
  global.AUDRALIA_CLEAN_CANVAS_AUTHORITY = AUDRALIA_ENGINE;
  global.AudraliaCleanCanvasEngine = AUDRALIA_ENGINE;
  global.audraliaCleanCanvasEngine = AUDRALIA_ENGINE;
  global.mountAudraliaCleanCanvas = mount;
  global.renderAudraliaCleanCanvas = mount;
  global.mountAudralia = mount;
  global.renderAudralia = mount;
})();
