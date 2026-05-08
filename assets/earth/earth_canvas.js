/* /assets/earth/earth_canvas.js
   HEARTH_G1_CANVAS_DIGITAL_PROOF_256_LATTICE_SYNTHESIS_TNT_v1
   Canvas authority for Hearth: hybrid / simulation Earth.
*/

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G1_CANVAS_DIGITAL_PROOF_256_LATTICE_SYNTHESIS_TNT_v1";
  const SIZE = 520;
  const CENTER = SIZE / 2;
  const RADIUS = SIZE * 0.412;
  const TWO_PI = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  const state = {
    phase: 0.16,
    cloudPhase: 0.08,
    velocity: 0,
    dragging: false,
    lastX: 0,
    started: performance.now(),
    mounted: false
  };

  const light = normalize({ x: -0.46, y: -0.28, z: 0.84 });

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(a, b, x) {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function normalize(v) {
    const d = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
    return { x: v.x / d, y: v.y / d, z: v.z / d };
  }

  function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function mix(a, b, t) {
    return [
      lerp(a[0], b[0], t),
      lerp(a[1], b[1], t),
      lerp(a[2], b[2], t)
    ];
  }

  function angularDelta(a, b) {
    let d = a - b;
    while (d > Math.PI) d -= TWO_PI;
    while (d < -Math.PI) d += TWO_PI;
    return d;
  }

  function hash2(x, y) {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return s - Math.floor(s);
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
    let amplitude = 0.55;
    let frequency = 1;

    for (let i = 0; i < 5; i += 1) {
      value += noise2(x * frequency, y * frequency) * amplitude;
      frequency *= 2.03;
      amplitude *= 0.52;
    }

    return clamp(value, 0, 1);
  }

  function blob(lon, lat, lon0, lat0, rx, ry, amp) {
    const x = angularDelta(lon, lon0) / rx;
    const y = (lat - lat0) / ry;
    return amp * Math.exp(-(x * x + y * y));
  }

  function continentField(lon, lat) {
    let value = 0;

    value += blob(lon, lat, -2.35, 0.62, 0.42, 0.78, 1.15);
    value += blob(lon, lat, -2.02, -0.35, 0.34, 0.86, 1.08);
    value += blob(lon, lat, -1.30, -0.92, 0.30, 0.42, 0.72);

    value += blob(lon, lat, 0.20, 0.58, 1.12, 0.46, 1.28);
    value += blob(lon, lat, 1.35, 0.45, 0.88, 0.52, 1.12);
    value += blob(lon, lat, 0.54, -0.22, 0.40, 0.66, 0.94);
    value += blob(lon, lat, 1.28, -0.72, 0.38, 0.42, 0.62);

    value += blob(lon, lat, 2.18, -0.62, 0.34, 0.30, 0.55);
    value += blob(lon, lat, -3.05, -1.28, 3.2, 0.22, 0.92);

    const u = wrap01(lon / TWO_PI + 0.5);
    const v = clamp(0.5 - lat / Math.PI, 0, 1);
    const edge = fbm(u * 8.0 + 1.6, v * 5.5 - 0.4) * 0.26;

    return value + edge;
  }

  function sampleSurface(lat, lon, cloudPhase, time) {
    const u = wrap01(lon / TWO_PI + 0.5);
    const v = clamp(0.5 - lat / Math.PI, 0, 1);
    const absLat = Math.abs(lat) / HALF_PI;

    const field = continentField(lon, lat);
    const threshold = 0.68 + 0.06 * Math.sin(lon * 3.0 + lat * 2.0);
    const land = field > threshold && absLat < 0.86;
    const coast = Math.abs(field - threshold) < 0.075 && absLat < 0.86;

    const ice = smoothstep(0.74, 0.95, absLat + fbm(u * 5.3, v * 5.3) * 0.08);
    const elevation = land ? clamp((field - threshold) * 1.8 + fbm(u * 12.0, v * 8.0) * 0.42, 0, 1) : 0;
    const oceanDepth = land ? 0 : clamp((threshold - field) * 1.65 + fbm(u * 7.0 + 4.0, v * 5.0) * 0.22, 0, 1);
    const moisture = clamp(
      0.50 +
      0.26 * Math.cos(lat * 2.0) +
      0.18 * fbm(u * 8.0 + 9.0, v * 6.0 - 2.0) -
      0.22 * elevation,
      0,
      1
    );

    let color;
    let water = land ? 0 : 1;

    if (ice > 0.82) {
      color = mix([220, 236, 242], [248, 250, 246], ice);
      water = water ? 0.7 : 0.1;
    } else if (land) {
      const arid = moisture < 0.42 && Math.abs(lat) > 0.16 && Math.abs(lat) < 0.74;
      const forest = moisture >= 0.55 && elevation < 0.62;
      const highland = elevation >= 0.62;

      if (highland) color = mix([88, 90, 72], [190, 182, 146], elevation);
      else if (arid) color = mix([130, 106, 58], [196, 158, 84], 0.50 + elevation * 0.35);
      else if (forest) color = mix([22, 92, 56], [70, 142, 72], moisture);
      else color = mix([52, 116, 72], [124, 138, 78], elevation * 0.55);
    } else if (coast || oceanDepth < 0.20) {
      color = mix([13, 76, 105], [38, 168, 162], 1 - oceanDepth);
    } else {
      color = mix([3, 18, 54], [8, 58, 102], 1 - oceanDepth);
    }

    if (coast && ice < 0.75) {
      color = mix(color, land ? [188, 170, 112] : [50, 176, 164], 0.42);
    }

    const cellX = Math.floor(u * 16);
    const cellY = Math.floor(v * 16);
    const cell = hash2(cellX, cellY);
    color = mix(color, [color[0] + 18, color[1] + 18, color[2] + 18], (cell - 0.5) * 0.08);

    const cloudNoise =
      0.62 * fbm(u * 9.4 + cloudPhase * 6.0, v * 5.0 + time * 0.012) +
      0.24 * fbm(u * 23.0 - cloudPhase * 9.0, v * 11.0 + 2.0) +
      0.12 * Math.sin((u + cloudPhase) * TWO_PI * 3.0 + v * 7.0);

    const stormBand = smoothstep(0.12, 0.60, Math.cos(lat * 3.0) * 0.5 + 0.5);
    const cloudAlpha = clamp(smoothstep(0.58, 0.90, cloudNoise) * (0.28 + stormBand * 0.42), 0, 0.56);

    return { color, cloudAlpha, water };
  }

  function createCanvas() {
    const canvas = document.createElement("canvas");

    canvas.width = SIZE;
    canvas.height = SIZE;
    canvas.className = "hearth-canvas";
    canvas.dataset.contract = CONTRACT;
    canvas.dataset.body = "hearth";
    canvas.dataset.label = "Hearth";
    canvas.dataset.mode = "hybrid-simulation-earth";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Code-generated Hearth");

    return canvas;
  }

  function draw(canvas, ctx) {
    const image = ctx.createImageData(SIZE, SIZE);
    const data = image.data;
    const time = (performance.now() - state.started) / 1000;
    const tilt = 23.44 * Math.PI / 180;

    for (let py = 0; py < SIZE; py += 1) {
      const dy = (py + 0.5 - CENTER) / RADIUS;

      for (let px = 0; px < SIZE; px += 1) {
        const dx = (px + 0.5 - CENTER) / RADIUS;
        const rr = dx * dx + dy * dy;
        const idx = (py * SIZE + px) * 4;

        if (rr > 1) {
          data[idx] = 0;
          data[idx + 1] = 0;
          data[idx + 2] = 0;
          data[idx + 3] = 0;
          continue;
        }

        const z = Math.sqrt(Math.max(0, 1 - rr));
        const normal = { x: dx, y: -dy, z };

        const yTilted = normal.y * Math.cos(tilt) - normal.z * Math.sin(tilt);
        const zTilted = normal.y * Math.sin(tilt) + normal.z * Math.cos(tilt);

        const lat = Math.asin(clamp(yTilted, -1, 1));
        const lon = Math.atan2(normal.x, zTilted) + state.phase * TWO_PI;

        const sample = sampleSurface(lat, lon, state.cloudPhase, time);
        let color = sample.color.slice();

        const lightAmount = clamp(dot(normal, light) * 0.74 + 0.35, 0.14, 1.08);
        const limb = clamp(1 - normal.z, 0, 1);
        const haze = Math.pow(limb, 2.25);
        const rim = Math.pow(limb, 3.0);

        color[0] *= lightAmount;
        color[1] *= lightAmount;
        color[2] *= lightAmount;

        if (sample.water > 0.5) {
          const specular = Math.pow(clamp(dot(normal, light), 0, 1), 18) * Math.pow(1 - limb, 3.2);
          color[0] += specular * 42;
          color[1] += specular * 68;
          color[2] += specular * 98;
        }

        color = mix(color, [82, 154, 230], haze * 0.20);

        if (sample.cloudAlpha > 0) {
          color = mix(color, [232, 238, 235], sample.cloudAlpha * clamp(0.42 + lightAmount * 0.58, 0, 1));
        }

        color[0] += rim * 22;
        color[1] += rim * 46;
        color[2] += rim * 86;

        data[idx] = clamp(Math.round(color[0]), 0, 255);
        data[idx + 1] = clamp(Math.round(color[1]), 0, 255);
        data[idx + 2] = clamp(Math.round(color[2]), 0, 255);
        data[idx + 3] = 255;
      }
    }

    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.putImageData(image, 0, 0);

    ctx.save();
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS + 2, 0, TWO_PI);
    ctx.strokeStyle = "rgba(188,223,255,.36)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS + 16, 0, TWO_PI);
    ctx.strokeStyle = "rgba(102,174,255,.16)";
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.restore();

    canvas.dataset.phase = state.phase.toFixed(5);
    canvas.dataset.cloudPhase = state.cloudPhase.toFixed(5);
  }

  function bindControls(canvas, ctx) {
    canvas.addEventListener("pointerdown", (event) => {
      state.dragging = true;
      state.lastX = event.clientX;
      state.velocity = 0;

      try {
        canvas.setPointerCapture(event.pointerId);
      } catch (error) {}

      if (event.cancelable) event.preventDefault();
    }, { passive: false });

    window.addEventListener("pointermove", (event) => {
      if (!state.dragging) return;

      const dx = event.clientX - state.lastX;
      state.lastX = event.clientX;

      const delta = -dx * 0.00145;
      state.phase = wrap01(state.phase + delta);
      state.cloudPhase = wrap01(state.cloudPhase + delta * 0.42);
      state.velocity = delta * 0.58;

      draw(canvas, ctx);

      if (event.cancelable) event.preventDefault();
    }, { passive: false });

    window.addEventListener("pointerup", () => {
      state.dragging = false;
    });

    window.addEventListener("pointercancel", () => {
      state.dragging = false;
    });
  }

  function tick(canvas, ctx) {
    state.phase = wrap01(state.phase + 0.00062 + state.velocity);
    state.cloudPhase = wrap01(state.cloudPhase + 0.00024 + state.velocity * 0.42);
    state.velocity *= 0.945;

    if (Math.abs(state.velocity) < 0.000012) state.velocity = 0;

    draw(canvas, ctx);
    requestAnimationFrame(() => tick(canvas, ctx));
  }

  function mount(target) {
    if (!target || state.mounted) return null;

    const canvas = createCanvas();
    const ctx = canvas.getContext("2d", { alpha: true });

    target.replaceChildren(canvas);
    target.dataset.contract = CONTRACT;
    target.dataset.body = "hearth";
    target.dataset.label = "Hearth";
    target.dataset.mode = "hybrid-simulation-earth";

    state.mounted = true;

    bindControls(canvas, ctx);
    draw(canvas, ctx);
    tick(canvas, ctx);

    return canvas;
  }

  function autoMount() {
    const target =
      document.getElementById("hearthRenderMount") ||
      document.querySelector("[data-hearth-render-mount]") ||
      document.getElementById("earthRenderMount") ||
      document.querySelector("[data-earth-render-mount]");

    if (!target) return;
    mount(target);
  }

  window.DGBHearthCanvas = Object.freeze({
    contract: CONTRACT,
    mount
  });

  window.DGBEarthCanvas = window.DGBHearthCanvas;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount, { once: true });
  } else {
    autoMount();
  }
})();
