// TARGET FILE: /showroom/index.diamond.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_DIAMOND_G2_VISUAL_VARIANTS_BOUNDED_RENDERER_TNT_v3
//
// Purpose:
// - Increase visible difference between dimensional variants.
// - Prevent freeze/truncation behavior by keeping render passes bounded.
// - Preserve clean viewport, G2 gem-governed object, 16 × 16 / 256 authority.
// - Preserve existing HTML/UI hooks.
//
// Owns:
// - Diamond canvas rendering.
// - Visual variants.
// - Renderer API.
//
// Does not own:
// - HTML shell.
// - UI controller.
// - Jump pads.
// - Generated images.
// - GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "SHOWROOM_DIAMOND_G2_VISUAL_VARIANTS_BOUNDED_RENDERER_TNT_v3";
  const PREVIOUS = "SHOWROOM_DIAMOND_G2_DIMENSIONAL_PROOF_OBJECT_RENDERER_TNT_v2";
  const FAMILY = "SHOWROOM_DIAMOND_G2_FULL_CONTRACT_RENEWAL_THREE_FILE_FAMILY_v1";
  const API_NAME = "DGBShowroomDiamondG2";

  const RADIAL_NODES = 16;
  const FIBONACCI_BANDS = 16;
  const LATTICE_SEATS = 256;
  const TAU = Math.PI * 2;

  const FIBONACCI_SEQUENCE = Object.freeze([
    1, 1, 2, 3, 5, 8, 13, 21,
    34, 55, 89, 144, 233, 377, 610, 987
  ]);

  const FIBONACCI_OFFSETS = Object.freeze([1, 2, 3, 5, 8, 13]);

  const DIMENSIONS = Object.freeze({
    object: {
      label: "Object Only",
      status: "Object Only active · clean gem-first proof object"
    },
    memory: {
      label: "World Memory",
      status: "World Memory active · internal world-pressure bands"
    },
    behind: {
      label: "Lattice Behind",
      status: "Lattice Behind active · proof field behind the Diamond"
    },
    through: {
      label: "Lattice Through",
      status: "Lattice Through active · structure passing through the gem"
    },
    full: {
      label: "Full Proof",
      status: "Full Proof active · complete object + memory + lattice field"
    }
  });

  const LENS_COPY = Object.freeze({
    crystal: {
      title: "Crystal Form",
      route: "Crystal Form → G2 bounded proof gem",
      copy:
        "Crystal Form shows the object first: a globe-inspired but gem-governed Diamond with clean facets, glints, and a restrained proof field."
    },
    lattice: {
      title: "Lattice Structure",
      route: "Lattice Structure → 16 radial nodes × 16 Fibonacci bands = 256 seats",
      copy:
        "Lattice Structure reveals the computable proof field without changing the Diamond into a planet or globe."
    }
  });

  const state = {
    stage: null,
    canvas: null,
    ctx: null,
    resizeObserver: null,

    width: 0,
    height: 0,
    dpr: 1,

    lens: "crystal",
    dimension: "object",

    seats: [],
    facets: [],
    crystalLines: [],
    latticeLines: [],
    fibonacciLines: [],
    points: [],

    yaw: -0.64,
    pitch: -0.20,
    roll: 0.02,
    velocityYaw: 0,
    velocityPitch: 0,

    dragging: false,
    pointerId: null,
    pointerX: 0,
    pointerY: 0,
    lastTap: 0,

    time: 0,
    lastFrame: 0,
    raf: 0,
    renderCount: 0,

    geometryBuilt: false,
    canvasReady: false,
    initialized: false,
    stopped: false,
    errors: []
  };

  if (
    window.__SHOWROOM_DIAMOND_G2_RENDERER_CONTROLLER__ &&
    typeof window.__SHOWROOM_DIAMOND_G2_RENDERER_CONTROLLER__.stop === "function"
  ) {
    try {
      window.__SHOWROOM_DIAMOND_G2_RENDERER_CONTROLLER__.stop();
    } catch (_error) {}
  }

  const abortController = typeof AbortController !== "undefined" ? new AbortController() : null;
  const signal = abortController ? abortController.signal : undefined;

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function query(selector, root = document) {
    try {
      return root.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function all(selector, root = document) {
    try {
      return Array.from(root.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function setText(selector, value) {
    const node = query(selector);
    if (!node) return false;
    const text = String(value);
    if (node.textContent !== text) node.textContent = text;
    return true;
  }

  function setDataset(key, value) {
    const text = String(value);
    try {
      document.documentElement.dataset[key] = text;
      if (document.body) document.body.dataset[key] = text;
    } catch (_error) {}
  }

  function now() {
    return typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  }

  function roleForBand(band) {
    if (band <= 1) return "table";
    if (band <= 5) return "crown";
    if (band <= 8) return "girdle";
    if (band <= 14) return "pavilion";
    return "culet";
  }

  function fibonacciWeight(band) {
    return FIBONACCI_SEQUENCE[band] / FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.length - 1];
  }

  function makeSeat(band, radial) {
    const radiusProfile = [
      0.26, 0.36, 0.49, 0.66,
      0.84, 1.02, 1.16, 1.21,
      1.12, 0.97, 0.80, 0.61,
      0.44, 0.28, 0.14, 0.045
    ];

    const heightProfile = [
      0.64, 0.59, 0.51, 0.40,
      0.28, 0.15, 0.035, -0.045,
      -0.125, -0.245, -0.380, -0.515,
      -0.640, -0.735, -0.805, -0.850
    ];

    const angle = (radial / RADIAL_NODES) * TAU;
    const fib = fibonacciWeight(band);
    const worldPressure = Math.sin((band / (FIBONACCI_BANDS - 1)) * Math.PI);

    const cut =
      1 +
      (radial % 2 === 0 ? 0.018 : -0.030) +
      (radial % 4 === 0 ? 0.045 : 0) +
      (radial % 4 === 2 ? -0.020 : 0);

    const radius = radiusProfile[band] * cut * (1 + worldPressure * 0.055) * (1 + (fib - 0.5) * 0.06);
    const zScale = 0.71 + Math.sin(band * 0.55 + radial * 0.21) * 0.024;

    return Object.freeze({
      seatIndex: band * RADIAL_NODES + radial,
      band,
      radial,
      role: roleForBand(band),
      fibonacci: FIBONACCI_SEQUENCE[band],
      fibonacciWeight: fib,
      angle,
      x: Math.cos(angle) * radius,
      y: heightProfile[band],
      z: Math.sin(angle) * radius * zScale,
      major: radial % 4 === 0 || band % 4 === 0,
      secondary: radial % 2 === 0 || band % 2 === 0,
      worldPressure
    });
  }

  function buildGeometry() {
    const rings = [];

    for (let band = 0; band < FIBONACCI_BANDS; band += 1) {
      const ring = [];
      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        ring.push(makeSeat(band, radial));
      }
      rings.push(Object.freeze(ring));
    }

    function seat(band, radial) {
      return rings[band][((radial % RADIAL_NODES) + RADIAL_NODES) % RADIAL_NODES];
    }

    const facets = [];
    const crystalLines = [];
    const latticeLines = [];
    const fibonacciLines = [];
    const points = [];

    function line(a, b, family, weight) {
      return Object.freeze({
        a,
        b,
        family,
        weight,
        major: a.major || b.major,
        secondary: a.secondary || b.secondary
      });
    }

    for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        const a = seat(band, radial);
        const b = seat(band, radial + 1);
        const c = seat(band + 1, radial + 1);
        const d = seat(band + 1, radial);

        facets.push(Object.freeze({ a, b, c, d, role: a.role }));

        if (radial % 2 === 0) {
          crystalLines.push(line(a, c, "crystal-diagonal", radial % 4 === 0 ? 1.25 : 0.72));
        }
      }
    }

    for (let band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        const a = seat(band, radial);
        const b = seat(band, radial + 1);

        crystalLines.push(line(a, b, "crystal-ring", band >= 6 && band <= 8 ? 1.55 : a.major ? 1.25 : 0.70));
        latticeLines.push(line(a, b, "lattice-ring", a.major ? 1.25 : 0.64));
      }
    }

    for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
      for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
        const a = seat(band, radial);
        const b = seat(band + 1, radial);

        crystalLines.push(line(a, b, radial % 4 === 0 ? "crystal-cardinal" : "crystal-spine", radial % 4 === 0 ? 1.45 : 0.70));
        latticeLines.push(line(a, b, radial % 4 === 0 ? "lattice-cardinal" : "lattice-spine", radial % 4 === 0 ? 1.35 : 0.64));
      }
    }

    for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
      const offset = FIBONACCI_OFFSETS[band % FIBONACCI_OFFSETS.length];

      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        const a = seat(band, radial);
        fibonacciLines.push(line(a, seat(band + 1, radial + offset), "fibonacci-forward", radial % 4 === 0 ? 1.00 : 0.56));

        if (band % 2 === 0) {
          fibonacciLines.push(line(a, seat(band + 1, radial - offset), "fibonacci-return", radial % 4 === 0 ? 0.82 : 0.48));
        }
      }
    }

    for (let band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        const s = seat(band, radial);
        points.push(Object.freeze({
          seat: s,
          size: s.major ? 4.7 : s.secondary ? 3.1 : 2.0,
          major: s.major,
          secondary: s.secondary
        }));
      }
    }

    state.seats = rings.flat();
    state.facets = facets;
    state.crystalLines = crystalLines;
    state.latticeLines = latticeLines;
    state.fibonacciLines = fibonacciLines;
    state.points = points;
    state.geometryBuilt = state.seats.length === LATTICE_SEATS;
  }

  function rotatePoint(point) {
    let x = point.x;
    let y = point.y;
    let z = point.z;

    const cy = Math.cos(state.yaw);
    const sy = Math.sin(state.yaw);
    const x1 = x * cy + z * sy;
    const z1 = -x * sy + z * cy;
    x = x1;
    z = z1;

    const cp = Math.cos(state.pitch);
    const sp = Math.sin(state.pitch);
    const y1 = y * cp - z * sp;
    const z2 = y * sp + z * cp;
    y = y1;
    z = z2;

    const cr = Math.cos(state.roll);
    const sr = Math.sin(state.roll);
    return {
      x: x * cr - y * sr,
      y: x * sr + y * cr,
      z
    };
  }

  function metrics() {
    const width = state.width || 640;
    const height = state.height || 720;
    const minSide = Math.min(width, height);
    const cssWidth = width / Math.max(1, state.dpr);

    return {
      centerX: width / 2,
      centerY: height * (cssWidth < 680 ? 0.51 : 0.50),
      scale: minSide * (cssWidth < 680 ? 0.37 : 0.405),
      cameraDistance: 4.55
    };
  }

  function projectSeat(seat) {
    const m = metrics();
    const r = rotatePoint(seat);
    const perspective = m.cameraDistance / Math.max(0.72, m.cameraDistance - r.z);

    return {
      x: m.centerX + r.x * m.scale * perspective,
      y: m.centerY - r.y * m.scale * perspective,
      z: r.z,
      perspective,
      frontFacing: r.z >= -0.18
    };
  }

  function clear() {
    state.ctx.clearRect(0, 0, state.width, state.height);
  }

  function drawAmbient(level) {
    const ctx = state.ctx;
    const m = metrics();

    ctx.save();

    const glow = ctx.createRadialGradient(
      m.centerX,
      m.centerY,
      m.scale * 0.08,
      m.centerX,
      m.centerY,
      m.scale * 1.65
    );

    glow.addColorStop(0, `rgba(141,216,255,${0.10 + level * 0.08})`);
    glow.addColorStop(0.38, `rgba(36,120,255,${0.05 + level * 0.05})`);
    glow.addColorStop(0.76, `rgba(243,200,111,${0.035 + level * 0.035})`);
    glow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(m.centerX, m.centerY, m.scale * 1.65, 0, TAU);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.restore();
  }

  function facetColor(facet, depth, alpha) {
    const role = facet.role;
    const light = clamp(0.70 + depth * 0.28, 0.55, 1.08);

    let r = 120;
    let g = 205;
    let b = 255;

    if (role === "table") {
      r = 236; g = 252; b = 255;
    } else if (role === "crown") {
      r = 135; g = 220; b = 255;
    } else if (role === "girdle") {
      r = 255; g = 211; b = 115;
    } else if (role === "pavilion") {
      r = 55; g = 116; b = 225;
    } else {
      r = 35; g = 70; b = 140;
    }

    return `rgba(${Math.round(r * light)},${Math.round(g * light)},${Math.round(b * light)},${alpha})`;
  }

  function drawFacets(alpha) {
    const ctx = state.ctx;

    ctx.save();

    for (const facet of state.facets) {
      const a = projectSeat(facet.a);
      const b = projectSeat(facet.b);
      const c = projectSeat(facet.c);
      const d = projectSeat(facet.d);
      const depth = ((a.z + b.z + c.z + d.z) / 4 + 1.4) / 2.8;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(c.x, c.y);
      ctx.lineTo(d.x, d.y);
      ctx.closePath();
      ctx.fillStyle = facetColor(facet, depth, alpha);
      ctx.fill();

      if (facet.a.major || facet.b.major) {
        ctx.strokeStyle = `rgba(255,242,190,${0.12 * alpha})`;
        ctx.lineWidth = Math.max(0.5, state.dpr * 0.42);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function lineColor(line, alpha) {
    if (line.family.indexOf("fibonacci") >= 0) {
      return line.major
        ? `rgba(255,220,103,${0.78 * alpha})`
        : `rgba(174,229,255,${0.38 * alpha})`;
    }

    if (line.family.indexOf("lattice") >= 0) {
      return line.major
        ? `rgba(255,220,105,${0.72 * alpha})`
        : `rgba(115,205,255,${0.42 * alpha})`;
    }

    if (line.family.indexOf("cardinal") >= 0) {
      return `rgba(255,228,143,${0.70 * alpha})`;
    }

    return `rgba(205,242,255,${0.36 * alpha})`;
  }

  function draw3DLines(lines, alpha, majorOnly) {
    const ctx = state.ctx;

    ctx.save();

    for (const line of lines) {
      if (majorOnly && !line.major) continue;

      const a = projectSeat(line.a);
      const b = projectSeat(line.b);

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = lineColor(line, alpha);
      ctx.lineWidth = Math.max(0.45, state.dpr * line.weight);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawPoints(alpha, majorOnly) {
    const ctx = state.ctx;

    ctx.save();

    for (const point of state.points) {
      if (majorOnly && !point.major) continue;

      const p = projectSeat(point.seat);
      const baseAlpha = p.frontFacing ? 1 : 0.25;
      const size = Math.max(1.2, point.size * state.dpr * p.perspective);

      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, TAU);
      ctx.fillStyle = point.major
        ? `rgba(255,224,116,${0.84 * alpha * baseAlpha})`
        : `rgba(141,216,255,${0.52 * alpha * baseAlpha})`;
      ctx.fill();
    }

    ctx.restore();
  }

  function drawBackgroundLattice(alpha) {
    const ctx = state.ctx;
    const m = metrics();
    const pulse = 0.5 + Math.sin(state.time * 1.25) * 0.5;

    ctx.save();

    ctx.translate(m.centerX, m.centerY);
    ctx.rotate(-0.18);

    for (let i = 1; i <= 5; i += 1) {
      ctx.beginPath();
      ctx.ellipse(0, 0, m.scale * (0.28 + i * 0.16), m.scale * (0.12 + i * 0.07), 0, 0, TAU);
      ctx.strokeStyle = i % 2 === 0
        ? `rgba(255,220,103,${alpha * 0.18})`
        : `rgba(141,216,255,${alpha * 0.20})`;
      ctx.lineWidth = Math.max(0.6, state.dpr * 0.7);
      ctx.stroke();
    }

    for (let i = 0; i < 16; i += 1) {
      const a = (i / 16) * TAU;
      const x = Math.cos(a) * m.scale * 1.03;
      const y = Math.sin(a) * m.scale * 0.47;

      ctx.beginPath();
      ctx.moveTo(-x, -y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = i % 4 === 0
        ? `rgba(255,220,103,${alpha * (0.22 + pulse * 0.06)})`
        : `rgba(141,216,255,${alpha * 0.10})`;
      ctx.lineWidth = Math.max(0.45, state.dpr * (i % 4 === 0 ? 0.95 : 0.48));
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawMemoryBands(alpha) {
    const ctx = state.ctx;
    const bands = [2, 4, 6, 8, 10, 12];
    const pulse = 0.5 + Math.sin(state.time * 1.55) * 0.5;

    ctx.save();

    for (const band of bands) {
      ctx.beginPath();

      for (let radial = 0; radial <= RADIAL_NODES; radial += 1) {
        const seat = state.seats[band * RADIAL_NODES + (radial % RADIAL_NODES)];
        const p = projectSeat(seat);

        if (radial === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }

      ctx.strokeStyle = band % 4 === 0
        ? `rgba(255,224,116,${alpha * (0.25 + pulse * 0.12)})`
        : `rgba(141,216,255,${alpha * (0.22 + pulse * 0.08)})`;
      ctx.lineWidth = Math.max(0.7, state.dpr * (band % 4 === 0 ? 1.05 : 0.75));
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawGlints(alpha) {
    const ctx = state.ctx;
    const m = metrics();
    const pulse = 0.5 + Math.sin(state.time * 1.8) * 0.5;

    ctx.save();
    ctx.translate(m.centerX, m.centerY);
    ctx.rotate(-0.52 + state.roll * 2);

    const glint = ctx.createLinearGradient(-m.scale, 0, m.scale, 0);
    glint.addColorStop(0, "rgba(255,255,255,0)");
    glint.addColorStop(0.48, `rgba(255,255,255,${alpha * (0.16 + pulse * 0.24)})`);
    glint.addColorStop(0.56, `rgba(255,230,150,${alpha * (0.10 + pulse * 0.12)})`);
    glint.addColorStop(1, "rgba(255,255,255,0)");

    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = glint;
    ctx.fillRect(-m.scale, -m.scale * 0.42, m.scale * 2, m.scale * 0.18);

    ctx.restore();
  }

  function drawRim(alpha) {
    const ctx = state.ctx;
    const m = metrics();

    ctx.save();

    ctx.beginPath();
    ctx.ellipse(m.centerX, m.centerY, m.scale * 0.98, m.scale * 0.70, 0, 0, TAU);
    ctx.strokeStyle = `rgba(255,231,150,${0.32 * alpha})`;
    ctx.lineWidth = Math.max(1, state.dpr * 1.05);
    ctx.stroke();

    ctx.restore();
  }

  function render() {
    if (!state.ctx || !state.geometryBuilt) return;

    clear();

    if (state.dimension === "object") {
      drawAmbient(0.55);
      drawFacets(0.96);
      draw3DLines(state.crystalLines, 0.65, true);
      drawPoints(0.60, true);
      drawGlints(1.0);
      drawRim(0.9);
    } else if (state.dimension === "memory") {
      drawAmbient(0.78);
      drawFacets(0.84);
      drawMemoryBands(1.35);
      draw3DLines(state.crystalLines, 0.46, true);
      drawPoints(0.38, true);
      drawGlints(0.68);
      drawRim(0.78);
    } else if (state.dimension === "behind") {
      drawAmbient(0.72);
      drawBackgroundLattice(1.10);
      drawFacets(0.96);
      draw3DLines(state.crystalLines, 0.58, true);
      drawPoints(0.34, true);
      drawGlints(0.72);
      drawRim(1.0);
    } else if (state.dimension === "through") {
      drawAmbient(0.85);
      drawFacets(0.58);
      draw3DLines(state.latticeLines, 1.00, false);
      draw3DLines(state.fibonacciLines, 1.10, false);
      draw3DLines(state.crystalLines, 0.30, true);
      drawPoints(0.86, false);
      drawGlints(0.38);
      drawRim(0.86);
    } else {
      drawAmbient(1.0);
      drawBackgroundLattice(0.95);
      drawMemoryBands(0.95);
      drawFacets(0.55);
      draw3DLines(state.latticeLines, 1.05, false);
      draw3DLines(state.fibonacciLines, 1.20, false);
      draw3DLines(state.crystalLines, 0.42, true);
      drawPoints(1.0, false);
      drawGlints(0.45);
      drawRim(1.0);
    }

    state.renderCount += 1;
  }

  function frame(timestamp) {
    if (state.stopped) return;

    const dt = state.lastFrame ? clamp((timestamp - state.lastFrame) / 1000, 0, 0.05) : 0;
    state.lastFrame = timestamp;
    state.time += dt;

    if (!state.dragging) {
      state.yaw += state.velocityYaw;
      state.pitch += state.velocityPitch;

      const damping = Math.pow(0.936, dt * 60);
      state.velocityYaw *= damping;
      state.velocityPitch *= damping;

      if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
      if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;

      if (state.velocityYaw === 0 && state.velocityPitch === 0) {
        state.yaw += Math.sin(state.time * 0.24) * dt * 0.014;
      }
    }

    state.pitch = clamp(state.pitch, -0.92, 0.74);
    state.roll = Math.sin(state.time * 0.18) * 0.015;

    render();
    state.raf = window.requestAnimationFrame(frame);
  }

  function resizeCanvas() {
    if (!state.canvas || !state.ctx) return;

    const rect = state.canvas.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(1.55, window.devicePixelRatio || 1));
    const width = Math.max(320, Math.floor((rect.width || 640) * dpr));
    const height = Math.max(520, Math.floor((rect.height || 720) * dpr));

    if (state.canvas.width !== width) state.canvas.width = width;
    if (state.canvas.height !== height) state.canvas.height = height;

    state.width = width;
    state.height = height;
    state.dpr = dpr;

    render();
  }

  function enforceCanvas() {
    if (!state.stage) return false;

    let canvas = query("[data-showroom-diamond-canvas]", state.stage);

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("data-showroom-diamond-canvas", "");
      canvas.setAttribute("aria-label", "Interactive G2 Diamond proof object canvas");
      state.stage.appendChild(canvas);
    }

    all("canvas", state.stage).forEach((item) => {
      if (item === canvas) return;
      try {
        item.remove();
      } catch (_error) {}
    });

    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      background: "transparent"
    });

    canvas.setAttribute("data-showroom-diamond-g2-renderer", CONTRACT);
    canvas.setAttribute("data-previous-renderer", PREVIOUS);
    canvas.setAttribute("data-visual-variants", "object,memory,behind,through,full");
    canvas.setAttribute("data-freeze-guard", "bounded-renderer");

    state.canvas = canvas;
    state.ctx = canvas.getContext("2d", { alpha: true });
    state.canvasReady = Boolean(state.ctx);

    return state.canvasReady;
  }

  function bindPointer() {
    if (!state.stage) return;

    state.stage.style.touchAction = "none";

    state.stage.addEventListener("pointerdown", (event) => {
      const t = now();

      if (t - state.lastTap < 320) reset();
      state.lastTap = t;

      state.dragging = true;
      state.pointerId = event.pointerId;
      state.pointerX = event.clientX;
      state.pointerY = event.clientY;
      state.velocityYaw = 0;
      state.velocityPitch = 0;

      try {
        state.stage.setPointerCapture(event.pointerId);
      } catch (_error) {}

      try {
        event.preventDefault();
      } catch (_error2) {}
    }, signal ? { signal, passive: false } : { passive: false });

    state.stage.addEventListener("pointermove", (event) => {
      if (!state.dragging) return;

      const dx = event.clientX - state.pointerX;
      const dy = event.clientY - state.pointerY;

      state.pointerX = event.clientX;
      state.pointerY = event.clientY;

      state.yaw += dx * 0.0084;
      state.pitch = clamp(state.pitch + dy * 0.0056, -0.92, 0.74);
      state.velocityYaw = clamp(dx * 0.00235, -0.050, 0.050);
      state.velocityPitch = clamp(dy * 0.00155, -0.038, 0.038);

      try {
        event.preventDefault();
      } catch (_error) {}
    }, signal ? { signal, passive: false } : { passive: false });

    function release(event) {
      if (!state.dragging) return;

      state.dragging = false;

      try {
        if (state.pointerId !== null) state.stage.releasePointerCapture(state.pointerId);
      } catch (_error) {}

      state.pointerId = null;

      try {
        event.preventDefault();
      } catch (_error2) {}
    }

    state.stage.addEventListener("pointerup", release, signal ? { signal, passive: false } : { passive: false });
    state.stage.addEventListener("pointercancel", release, signal ? { signal, passive: false } : { passive: false });
    state.stage.addEventListener("lostpointercapture", release, signal ? { signal, passive: false } : { passive: false });
  }

  function setupResize() {
    resizeCanvas();

    if (typeof ResizeObserver !== "undefined" && state.stage) {
      state.resizeObserver = new ResizeObserver(resizeCanvas);
      try {
        state.resizeObserver.observe(state.stage);
      } catch (_error) {}
    }

    window.addEventListener("resize", resizeCanvas, signal ? { signal, passive: true } : { passive: true });
    window.addEventListener("orientationchange", () => {
      setTimeout(resizeCanvas, 120);
    }, signal ? { signal, passive: true } : { passive: true });
  }

  function updateLensCopy() {
    const copy = LENS_COPY[state.lens] || LENS_COPY.crystal;

    setText("[data-diamond-lens-title]", copy.title);
    setText("[data-diamond-route-label]", copy.route);
    setText("[data-diamond-lens-copy]", copy.copy);

    all("[data-diamond-lens]").forEach((button) => {
      const active = button.dataset.diamondLens === state.lens;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.toggleAttribute("data-active", active);
    });
  }

  function updateDimensionControls() {
    const copy = DIMENSIONS[state.dimension] || DIMENSIONS.object;

    all("[data-diamond-dimension]").forEach((button) => {
      const active = button.dataset.diamondDimension === state.dimension;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.toggleAttribute("data-active", active);
    });

    setText("[data-diamond-dimension-label]", copy.label);
    setText("[data-showroom-diamond-status]", copy.status);
  }

  function setLens(nextLens) {
    state.lens = nextLens === "lattice" ? "lattice" : "crystal";

    if (state.lens === "lattice" && (state.dimension === "object" || state.dimension === "memory")) {
      state.dimension = "through";
    }

    if (state.lens === "crystal" && state.dimension === "full") {
      state.dimension = "object";
    }

    setDataset("showroomDiamondG2Lens", state.lens);
    updateLensCopy();
    updateDimensionControls();
    render();
    publishStatus("set-lens");

    return status();
  }

  function setDimension(nextDimension) {
    state.dimension = Object.prototype.hasOwnProperty.call(DIMENSIONS, nextDimension)
      ? nextDimension
      : "object";

    state.lens = state.dimension === "through" || state.dimension === "full" ? "lattice" : "crystal";

    setDataset("showroomDiamondG2Dimension", state.dimension);
    setDataset("showroomDiamondG2Lens", state.lens);

    updateLensCopy();
    updateDimensionControls();
    render();
    publishStatus("set-dimension");

    return status();
  }

  function reset() {
    state.yaw = -0.64;
    state.pitch = -0.20;
    state.roll = 0.02;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    state.time = 0;

    render();
    publishStatus("reset");

    return status();
  }

  function bindControls() {
    all("[data-diamond-lens]").forEach((button) => {
      button.addEventListener("click", () => setLens(button.dataset.diamondLens), signal ? { signal } : false);
    });

    all("[data-diamond-dimension]").forEach((button) => {
      button.addEventListener("click", () => setDimension(button.dataset.diamondDimension), signal ? { signal } : false);
    });

    const resetButton = query("[data-showroom-diamond-reset]");
    if (resetButton) {
      resetButton.addEventListener("click", reset, signal ? { signal } : false);
    }

    const inspectButton = query("[data-showroom-diamond-inspect]");
    if (inspectButton) {
      inspectButton.addEventListener("click", () => {
        const copy = DIMENSIONS[state.dimension] || DIMENSIONS.object;
        setText("[data-showroom-diamond-status]", `${copy.status} · ${LATTICE_SEATS} seats · bounded renderer`);
        publishStatus("inspect");
      }, signal ? { signal } : false);
    }
  }

  function status() {
    return Object.freeze({
      contract: CONTRACT,
      previousRenderer: PREVIOUS,
      contractFamily: FAMILY,
      route: "/showroom/",
      target: "/showroom/index.diamond.js",
      role: "diamond_renderer",

      object: "G2_visual_variants_bounded_gem_globe_proof_object",
      activeLens: state.lens,
      activeDimension: state.dimension,
      variants: Object.keys(DIMENSIONS),

      globeInspired: true,
      gemGoverned: true,
      planet: false,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeSeats: LATTICE_SEATS,
      seatCount: state.seats.length,
      facetCount: state.facets.length,
      crystalLineCount: state.crystalLines.length,
      latticeLineCount: state.latticeLines.length,
      fibonacciLineCount: state.fibonacciLines.length,
      pointCount: state.points.length,

      freezeGuard: "bounded_rendering_no_status_publish_per_frame",
      geometryBuilt: state.geometryBuilt,
      canvasReady: state.canvasReady,
      initialized: state.initialized,

      generatedImage: false,
      graphicBox: false,
      externalImageAsset: false,

      renderCount: state.renderCount,
      errors: state.errors.slice()
    });
  }

  function publishStatus(scope = "status") {
    const payload = Object.freeze({
      ...status(),
      scope,
      time: new Date().toISOString()
    });

    window.SHOWROOM_DIAMOND_G2_RENDERER_RECEIPT = payload;
    window.SHOWROOM_DIAMOND_G2_VISUAL_VARIANTS_STATUS = payload;
    window.DGB_SHOWROOM_DIAMOND_G2_STATUS = payload;

    setDataset("showroomDiamondG2RendererContract", CONTRACT);
    setDataset("showroomDiamondG2RendererActive", "true");
    setDataset("showroomDiamondG2Dimension", state.dimension);
    setDataset("showroomDiamondG2Lens", state.lens);
    setDataset("showroomDiamondG2VisualVariants", "object,memory,behind,through,full");
    setDataset("showroomDiamondG2FreezeGuard", "bounded-renderer");
    setDataset("showroomDiamondG2GeneratedImage", "false");
    setDataset("showroomDiamondG2GraphicBox", "false");

    return payload;
  }

  function exposeApi() {
    window[API_NAME] = Object.freeze({
      contract: CONTRACT,
      contractFamily: FAMILY,
      setLens,
      setDimension,
      reset,
      render,
      status
    });
  }

  function start() {
    if (!state.raf && !state.stopped) {
      state.raf = window.requestAnimationFrame(frame);
    }
  }

  function stop() {
    state.stopped = true;

    if (state.raf) {
      try {
        window.cancelAnimationFrame(state.raf);
      } catch (_error) {}
    }

    if (state.resizeObserver) {
      try {
        state.resizeObserver.disconnect();
      } catch (_error2) {}
    }

    if (abortController) {
      try {
        abortController.abort();
      } catch (_error3) {}
    }
  }

  function init() {
    try {
      exposeApi();

      state.stage = query("[data-showroom-diamond-stage]");
      if (!state.stage) {
        throw new Error("Missing [data-showroom-diamond-stage]");
      }

      if (!enforceCanvas()) {
        throw new Error("Canvas context unavailable");
      }

      buildGeometry();
      bindPointer();
      setupResize();
      bindControls();

      updateLensCopy();
      updateDimensionControls();

      state.initialized = true;

      render();
      start();
      publishStatus("init-complete");

      try {
        window.dispatchEvent(new CustomEvent("showroom-diamond-g2-ready", { detail: status() }));
      } catch (_error) {}
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      state.errors.push({ scope: "init", message, time: new Date().toISOString() });
      setDataset("showroomDiamondG2Error", message);
      publishStatus("init-error");
    }
  }

  window.__SHOWROOM_DIAMOND_G2_RENDERER_CONTROLLER__ = {
    stop,
    state,
    contract: CONTRACT,
    setLens,
    setDimension,
    reset,
    status
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, signal ? { signal, once: true } : { once: true });
  } else {
    init();
  }
})();
