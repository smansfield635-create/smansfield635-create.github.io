/* /assets/earth/earth_canvas.js
   HEARTH_G2_CANVAS_TOPOLOGY_REFINEMENT_256_LATTICE_SYNTHESIS_TNT_v1
   Full-file replacement.
   Purpose:
   - Promote Hearth from G1 visible proof to G2 topology/material refinement.
   - Keep canvas authority self-contained.
   - Keep route shell clean.
   - Render Hearth as a hybrid simulation Earth from code.
*/

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G2_CANVAS_TOPOLOGY_REFINEMENT_256_LATTICE_SYNTHESIS_TNT_v1";

  const SIZE = 540;
  const CENTER = SIZE / 2;
  const RADIUS = SIZE * 0.414;
  const TWO_PI = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  const state = {
    phase: 0.19,
    cloudPhase: 0.06,
    velocity: 0,
    dragging: false,
    lastX: 0,
    started: performance.now(),
    mounted: false,
    raf: 0
  };

  const light = normalize({ x: -0.50, y: -0.28, z: 0.82 });

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

  function ridgedNoise(x, y) {
    return 1 - Math.abs(noise2(x, y) * 2 - 1);
  }

  function fbm(x, y, octaves = 5) {
    let value = 0;
    let amplitude = 0.55;
    let frequency = 1;

    for (let i = 0; i < octaves; i += 1) {
      value += noise2(x * frequency, y * frequency) * amplitude;
      frequency *= 2.03;
      amplitude *= 0.52;
    }

    return clamp(value, 0, 1);
  }

  function ridgedFbm(x, y, octaves = 5) {
    let value = 0;
    let amplitude = 0.55;
    let frequency = 1;

    for (let i = 0; i < octaves; i += 1) {
      value += ridgedNoise(x * frequency, y * frequency) * amplitude;
      frequency *= 2.06;
      amplitude *= 0.50;
    }

    return clamp(value, 0, 1);
  }

  function blob(lon, lat, lon0, lat0, rx, ry, amp) {
    const x = angularDelta(lon, lon0) / rx;
    const y = (lat - lat0) / ry;
    return amp * Math.exp(-(x * x + y * y));
  }

  function ribbon(lon, lat, lon0, lat0, angle, length, width, amp) {
    const dl = angularDelta(lon, lon0);
    const dp = lat - lat0;
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    const x = (dl * ca + dp * sa) / length;
    const y = (-dl * sa + dp * ca) / width;
    return amp * Math.exp(-(x * x + y * y));
  }

  function topologyField(lon, lat) {
    let value = 0;

    value += blob(lon, lat, -2.18, 0.55, 0.48, 0.72, 1.04);
    value += blob(lon, lat, -1.95, -0.28, 0.34, 0.80, 0.98);
    value += ribbon(lon, lat, -1.50, -0.72, -0.34, 0.50, 0.16, 0.56);
    value += blob(lon, lat, -1.25, -1.05, 0.24, 0.24, 0.36);

    value += blob(lon, lat, 0.04, 0.54, 0.88, 0.42, 0.92);
    value += blob(lon, lat, 1.05, 0.48, 0.74, 0.46, 0.86);
    value += blob(lon, lat, 1.78, 0.26, 0.46, 0.34, 0.54);
    value += ribbon(lon, lat, 0.55, -0.12, 0.12, 0.40, 0.28, 0.70);
    value += blob(lon, lat, 1.20, -0.70, 0.38, 0.36, 0.42);

    value += blob(lon, lat, 2.22, -0.62, 0.27, 0.22, 0.38);
    value += blob(lon, lat, 2.60, -0.42, 0.18, 0.15, 0.28);
    value += blob(lon, lat, -2.95, -1.26, 2.60, 0.20, 0.64);

    for (let i = 0; i < 16; i += 1) {
      const seedLon = -Math.PI + (i / 16) * TWO_PI + (hash2(i, 3) - 0.5) * 0.22;
      const seedLat = -1.05 + hash2(i, 9) * 2.0;
      const rx = 0.055 + hash2(i, 12) * 0.10;
      const ry = 0.040 + hash2(i, 18) * 0.09;
      const amp = 0.12 + hash2(i, 24) * 0.20;

      value += blob(lon, lat, seedLon, seedLat, rx, ry, amp);
    }

    const u = wrap01(lon / TWO_PI + 0.5);
    const v = clamp(0.5 - lat / Math.PI, 0, 1);

    const continentBreak =
      fbm(u * 8.5 + 1.6, v * 5.8 - 0.4, 5) * 0.19 +
      ridgedFbm(u * 16.0 - 2.5, v * 11.0 + 0.8, 4) * 0.12 -
      fbm(u * 5.0 - 3.0, v * 3.2 + 2.0, 4) * 0.08;

    return value + continentBreak;
  }

  function plateRidge(u, v) {
    const ridgeA = ridgedFbm(u * 12.0 + 2.1, v * 8.0 - 1.0, 5);
    const ridgeB = ridgedFbm(u * 26.0 - 4.0, v * 18.0 + 2.0, 4);
    return clamp(ridgeA * 0.68 + ridgeB * 0.32, 0, 1);
  }

  function shelfColor(base, shelf, coast) {
    const shelfBlue = mix([4, 38, 82], [31, 148, 166], shelf);
    return mix(base, shelfBlue, clamp(coast * 0.62 + shelf * 0.34, 0, 0.82));
  }

  function sampleSurface(lat, lon, cloudPhase, time) {
    const u = wrap01(lon / TWO_PI + 0.5);
    const v = clamp(0.5 - lat / Math.PI, 0, 1);
    const absLat = Math.abs(lat) / HALF_PI;

    const topology = topologyField(lon, lat);
    const edgeNoise =
      (fbm(u * 19.0 + 0.4, v * 13.0 - 1.8, 4) - 0.5) * 0.13 +
      (ridgedFbm(u * 34.0 - 1.2, v * 21.0 + 2.4, 3) - 0.5) * 0.07;

    const threshold = 0.70 + 0.030 * Math.sin(lon * 3.0 + lat * 2.0) + edgeNoise;
    const landMask = topology - threshold;
    const land = landMask > 0 && absLat < 0.89;

    const coast = 1 - smoothstep(0.006, 0.048, Math.abs(landMask));
    const shelf = land ? 0 : clamp(1 - smoothstep(0.01, 0.18, -landMask), 0, 1);

    const polarNoise = fbm(u * 8.0 + 1.0, v * 8.0 - 2.0, 5) * 0.10 + ridgedFbm(u * 18.0, v * 10.0, 3) * 0.05;
    const ice = smoothstep(0.76, 0.97, absLat + polarNoise - coast * 0.04);

    const ridges = plateRidge(u, v);
    const elevation = land
      ? clamp(landMask * 1.85 + ridges * 0.42 + fbm(u * 22.0, v * 15.0, 4) * 0.23, 0, 1)
      : 0;

    const oceanDepth = land
      ? 0
      : clamp((-landMask) * 1.7 + fbm(u * 9.0 + 4.0, v * 6.0, 4) * 0.22, 0, 1);

    const moisture = clamp(
      0.52 +
      0.30 * Math.cos(lat * 2.0) +
      0.18 * fbm(u * 8.0 + 9.0, v * 6.0 - 2.0, 4) -
      0.30 * elevation -
      0.16 * smoothstep(0.25, 0.72, Math.abs(lat)),
      0,
      1
    );

    let color;
    let water = land ? 0 : 1;

    if (ice > 0.82) {
      const iceBreak = fbm(u * 24.0, v * 16.0, 4);
      color = mix([202, 224, 232], [250, 252, 247], clamp(ice * 0.86 + iceBreak * 0.20, 0, 1));
      water = water ? 0.72 : 0.16;
    } else if (land) {
      const arid = moisture < 0.38 && Math.abs(lat) > 0.13 && Math.abs(lat) < 0.76;
      const forest = moisture >= 0.56 && elevation < 0.58;
      const grass = moisture >= 0.42 && moisture < 0.62 && elevation < 0.66;
      const highland = elevation >= 0.62;
      const snowCap = smoothstep(0.76, 0.98, elevation + absLat * 0.28 + ridges * 0.15);

      if (snowCap > 0.72) {
        color = mix([145, 148, 128], [236, 238, 226], snowCap);
      } else if (highland) {
        color = mix([84, 84, 70], [176, 166, 132], clamp(elevation * 0.92 + ridges * 0.18, 0, 1));
      } else if (arid) {
        color = mix([126, 102, 58], [202, 162, 86], clamp(0.48 + elevation * 0.42 + ridges * 0.14, 0, 1));
      } else if (forest) {
        color = mix([20, 82, 54], [62, 128, 66], clamp(moisture + ridges * 0.08, 0, 1));
      } else if (grass) {
        color = mix([52, 112, 70], [128, 142, 76], clamp(elevation * 0.45 + moisture * 0.20, 0, 1));
      } else {
        color = mix([88, 118, 72], [142, 132, 78], clamp(elevation * 0.52, 0, 1));
      }

      if (coast > 0.42) {
        color = mix(color, [172, 156, 108], coast * 0.16);
      }
    } else {
      const deep = mix([2, 13, 44], [6, 46, 94], clamp(1 - oceanDepth, 0, 1));
      color = shelfColor(deep, shelf, coast);
    }

    const cellX = Math.floor(u * 16);
    const cellY = Math.floor(v * 16);
    const latticePulse = hash2(cellX, cellY);
    color = mix(color, [color[0] + 14, color[1] + 14, color[2] + 14], (latticePulse - 0.5) * 0.045);

    const vaporBand =
      0.50 +
      0.22 * Math.cos(lat * 5.4 + Math.sin(u * TWO_PI * 2.0)) +
      0.20 * fbm(u * 5.0 + cloudPhase * 2.5, v * 12.0, 4);

    const cloudNoise =
      0.56 * fbm(u * 9.5 + cloudPhase * 6.0, v * 5.0 + time * 0.010, 5) +
      0.27 * ridgedFbm(u * 20.0 - cloudPhase * 8.0, v * 10.0 + 2.0, 4) +
      0.12 * Math.sin((u + cloudPhase) * TWO_PI * 3.0 + v * 7.0);

    const stormA = blob(lon + cloudPhase * TWO_PI * 0.7, lat, 1.85, -0.26, 0.28, 0.22, 1.0);
    const stormB = blob(lon - cloudPhase * TWO_PI * 0.5, lat, -1.15, 0.18, 0.22, 0.18, 0.7);
    const storm = clamp(stormA + stormB, 0, 1);

    const cloudAlpha = clamp(
      smoothstep(0.62, 0.92, cloudNoise) * (0.22 + vaporBand * 0.34) +
      storm * 0.24,
      0,
      0.54
    );

    return { color, cloudAlpha, water, elevation, shelf, coast, ice };
  }

  function createCanvas() {
    const canvas = document.createElement("canvas");

    canvas.width = SIZE;
    canvas.height = SIZE;
    canvas.className = "hearth-canvas hearth-g2-canvas";
    canvas.dataset.contract = CONTRACT;
    canvas.dataset.body = "hearth";
    canvas.dataset.label = "Hearth";
    canvas.dataset.generation = "G2";
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

        const lightAmount = clamp(dot(normal, light) * 0.76 + 0.34, 0.13, 1.10);
        const limb = clamp(1 - normal.z, 0, 1);
        const haze = Math.pow(limb, 2.35);
        const rim = Math.pow(limb, 3.1);
        const terminator = smoothstep(0.02, 0.70, dot(normal, light));

        color[0] *= lightAmount;
        color[1] *= lightAmount;
        color[2] *= lightAmount;

        color = mix(color, [3, 8, 18], (1 - terminator) * 0.22);

        if (sample.water > 0.5) {
          const specular = Math.pow(clamp(dot(normal, light), 0, 1), 22) * Math.pow(1 - limb, 3.4);
          color[0] += specular * 38;
          color[1] += specular * 66;
          color[2] += specular * 108;
        }

        if (sample.cloudAlpha > 0) {
          color = mix(color, [230, 237, 236], sample.cloudAlpha * clamp(0.38 + lightAmount * 0.62, 0, 1));
        }

        color = mix(color, [74, 142, 218], haze * 0.16);

        color[0] += rim * 18;
        color[1] += rim * 42;
        color[2] += rim * 88;

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
    ctx.strokeStyle = "rgba(188,223,255,.34)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS + 15, 0, TWO_PI);
    ctx.strokeStyle = "rgba(102,174,255,.15)";
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS + 30, 0, TWO_PI);
    ctx.strokeStyle = "rgba(102,174,255,.055)";
    ctx.lineWidth = 16;
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
    state.phase = wrap01(state.phase + 0.00058 + state.velocity);
    state.cloudPhase = wrap01(state.cloudPhase + 0.00027 + state.velocity * 0.42);
    state.velocity *= 0.945;

    if (Math.abs(state.velocity) < 0.000012) state.velocity = 0;

    draw(canvas, ctx);
    state.raf = requestAnimationFrame(() => tick(canvas, ctx));
  }

  function mount(target) {
    if (!target || state.mounted) return null;

    const canvas = createCanvas();
    const ctx = canvas.getContext("2d", { alpha: true });

    target.replaceChildren(canvas);
    target.dataset.contract = CONTRACT;
    target.dataset.body = "hearth";
    target.dataset.label = "Hearth";
    target.dataset.generation = "G2";
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
    generation: "G2",
    mount
  });

  window.DGBEarthCanvas = window.DGBHearthCanvas;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount, { once: true });
  } else {
    autoMount();
  }
})();
