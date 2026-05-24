// TARGET FILE: /showroom/index.diamond.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_DIAMOND_G2_DIMENSIONAL_PROOF_OBJECT_RENDERER_TNT_v2
//
// Owns:
// - G2 Diamond proof-object renderer
// - globe-inspired but gem-governed geometry
// - Crystal Form / Lattice Structure
// - dimensional visual modes
// - drag / glide / reset
// - renderer API
//
// Does not own:
// - HTML shell
// - page narrative
// - jump-pad routing
// - UI controller
// - generated images
// - GraphicBox

(() => {
  "use strict";

  const CONTRACT = "SHOWROOM_DIAMOND_G2_DIMENSIONAL_PROOF_OBJECT_RENDERER_TNT_v2";
  const PREVIOUS = "SHOWROOM_DIAMOND_G2_GEM_GLOBE_PROOF_OBJECT_RENDERER_TNT_v1";
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

  const LENS_COPY = Object.freeze({
    crystal: {
      title: "Crystal Form",
      route: "Crystal Form → G2 dimensional proof gem",
      copy:
        "Crystal Form shows the object first: a globe-inspired but gem-governed Diamond with internal world pressure and imperfect crystalline planes."
    },
    lattice: {
      title: "Lattice Structure",
      route: "Lattice Structure → 16 radial nodes × 16 Fibonacci bands = 256 seats",
      copy:
        "Lattice Structure reveals the computable proof field beneath the Diamond without replacing the object."
    }
  });

  const DIMENSION_COPY = Object.freeze({
    object: {
      label: "Object Only",
      status: "Object Only active · pure G2 proof gem"
    },
    memory: {
      label: "World Memory",
      status: "World Memory active · internal curvature and coordinate pressure"
    },
    behind: {
      label: "Lattice Behind",
      status: "Lattice Behind active · proof field behind the object"
    },
    through: {
      label: "Lattice Through",
      status: "Lattice Through active · structure visible through the gem"
    },
    full: {
      label: "Full Proof",
      status: "Full Proof active · object plus 16 × 16 / 256 proof field"
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
    edges: [],
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
    duplicateCanvasCount: 0,
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

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
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

  function now() {
    return typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  }

  function setDataset(key, value) {
    const text = String(value);

    try {
      document.documentElement.dataset[key] = text;
      if (document.body) document.body.dataset[key] = text;
    } catch (_error) {}
  }

  function setText(selector, value) {
    const node = query(selector);
    if (!node) return false;

    const text = String(value);
    if (node.textContent !== text) node.textContent = text;
    return true;
  }

  function recordError(scope, error) {
    const message = error && error.message ? error.message : String(error || scope);

    state.errors.push({
      scope,
      message,
      time: new Date().toISOString()
    });

    setDataset("showroomDiamondG2Error", message);
    publishStatus("error:" + scope);
  }

  function hash01(seed) {
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return value - Math.floor(value);
  }

  function fibonacciWeight(band) {
    const max = FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.length - 1];
    return FIBONACCI_SEQUENCE[band] / max;
  }

  function roleForBand(band) {
    if (band <= 1) return "table";
    if (band <= 5) return "crown";
    if (band <= 8) return "girdle";
    if (band <= 14) return "pavilion";
    return "culet";
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

    const fibNorm = fibonacciWeight(band);
    const angle = (radial / RADIAL_NODES) * TAU;

    const imperfectCut =
      1 +
      (radial % 2 === 0 ? 0.018 : -0.032) +
      (radial % 4 === 0 ? 0.050 : 0) +
      (radial % 4 === 2 ? -0.022 : 0) +
      (hash01(band * 23 + radial * 11) - 0.5) * 0.040;

    const worldPressure = Math.sin((band / (FIBONACCI_BANDS - 1)) * Math.PI);
    const globePressure = 1 + worldPressure * 0.055;
    const fibonacciBreath = 1 + (fibNorm - 0.5) * 0.065;

    const radius = radiusProfile[band] * imperfectCut * globePressure * fibonacciBreath;
    const height = heightProfile[band] + (hash01(radial + band * 19) - 0.5) * 0.012;

    const zScale = 0.71 + Math.sin(band * 0.55 + radial * 0.21) * 0.025;
    const xAsymmetry = 1 + Math.cos(radial * 0.9 + band * 0.16) * 0.025;

    return Object.freeze({
      seatIndex: band * RADIAL_NODES + radial,
      band,
      radial,
      role: roleForBand(band),
      fibonacci: FIBONACCI_SEQUENCE[band],
      fibonacciWeight: fibNorm,
      angle,
      radius,
      height,
      x: Math.cos(angle) * radius * xAsymmetry,
      y: height,
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
    const edges = [];
    const latticeLines = [];
    const fibonacciLines = [];
    const points = [];

    function addFacet(a, b, c, d, family) {
      facets.push(Object.freeze({ a, b, c, d, family, role: a.role }));
    }

    function addLine(a, b, family, weight) {
      const line = Object.freeze({
        a,
        b,
        family,
        weight: finite(weight, 1),
        major: a.major || b.major,
        secondary: a.secondary || b.secondary
      });

      if (family.indexOf("fibonacci") >= 0) fibonacciLines.push(line);
      else if (family.indexOf("lattice") >= 0) latticeLines.push(line);
      else edges.push(line);
    }

    for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        const a = seat(band, radial);
        const b = seat(band, radial + 1);
        const c = seat(band + 1, radial + 1);
        const d = seat(band + 1, radial);

        addFacet(a, b, c, d, band <= 2 ? "table-facet" : band <= 8 ? "crown-girdle-facet" : "pavilion-facet");

        if (radial % 2 === 0) addLine(a, c, "crystal-diagonal", radial % 4 === 0 ? 1.35 : 0.84);
        else addLine(b, d, "crystal-counter-diagonal", 0.72);
      }
    }

    for (let band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        const a = seat(band, radial);
        const b = seat(band, radial + 1);

        addLine(a, b, "crystal-band-edge", band >= 6 && band <= 8 ? 1.85 : a.major ? 1.50 : 0.88);
        addLine(a, b, "lattice-ring", a.major ? 1.45 : 0.82);
      }
    }

    for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
      for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
        const a = seat(band, radial);
        const b = seat(band + 1, radial);

        addLine(a, b, radial % 4 === 0 ? "crystal-cardinal-spine" : "crystal-spine", radial % 4 === 0 ? 1.70 : 0.86);
        addLine(a, b, radial % 4 === 0 ? "lattice-cardinal-spine" : "lattice-spine", radial % 4 === 0 ? 1.55 : 0.82);
      }
    }

    for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
      const offset = FIBONACCI_OFFSETS[band % FIBONACCI_OFFSETS.length];

      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        const a = seat(band, radial);
        addLine(a, seat(band + 1, radial + offset), `fibonacci-forward-${offset}`, radial % 4 === 0 || band % 4 === 0 ? 1.20 : 0.74);

        if (band % 2 === 0) {
          addLine(a, seat(band + 1, radial - offset), `fibonacci-return-${offset}`, radial % 4 === 0 ? 0.95 : 0.62);
        }
      }
    }

    for (let band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        const s = seat(band, radial);
        points.push(Object.freeze({
          seat: s,
          size: s.major ? 4.8 : s.secondary ? 3.4 : 2.4,
          major: s.major,
          secondary: s.secondary
        }));
      }
    }

    state.seats = rings.flat();
    state.facets = facets;
    state.edges = edges;
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
    const x2 = x * cr - y * sr;
    const y2 = x * sr + y * cr;

    return { x: x2, y: y2, z };
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
    const rotated = rotatePoint(seat);
    const perspective = m.cameraDistance / Math.max(0.72, m.cameraDistance - rotated.z);

    return {
      x: m.centerX + rotated.x * m.scale * perspective,
      y: m.centerY - rotated.y * m.scale * perspective,
      z: rotated.z,
      perspective,
      frontFacing: rotated.z >= -0.18
    };
  }

  function facetDepth(facet) {
    const a = rotatePoint(facet.a);
    const b = rotatePoint(facet.b);
    const c = rotatePoint(facet.c);
    const d = rotatePoint(facet.d);
    return (a.z + b.z + c.z + d.z) / 4;
  }

  function colorForFacet(facet, depth) {
    const role = facet.role;
    const t = clamp((depth + 1.25) / 2.5, 0, 1);
    const pulse = 0.5 + Math.sin(state.time * 1.7 + facet.a.band * 0.34 + facet.a.radial * 0.19) * 0.5;
    const fib = facet.a.fibonacciWeight;
    const world = facet.a.worldPressure;

    let r = 120;
    let g = 205;
    let b = 255;
    let a = 0.58;

    if (role === "table") {
      r = 238; g = 252; b = 255; a = 0.82;
    } else if (role === "crown") {
      r = lerp(126, 226, fib * 1.8); g = lerp(210, 244, t); b = 255; a = 0.72;
    } else if (role === "girdle") {
      r = 255; g = lerp(193, 231, t); b = lerp(88, 168, pulse); a = 0.76;
    } else if (role === "pavilion") {
      r = lerp(35, 98, t); g = lerp(88, 176, t); b = lerp(190, 255, world); a = 0.76;
    } else {
      r = 38; g = 75; b = 130; a = 0.70;
    }

    const light = clamp(0.70 + t * 0.35 + pulse * 0.08, 0.52, 1.18);
    return `rgba(${Math.round(r * light)},${Math.round(g * light)},${Math.round(b * light)},${clamp(a, 0, 0.94)})`;
  }

  function edgeColor(line, alphaScale = 1) {
    if (line.family.indexOf("fibonacci") >= 0) {
      return line.major
        ? `rgba(255,220,103,${0.62 * alphaScale})`
        : `rgba(174,229,255,${0.30 * alphaScale})`;
    }

    if (line.family.indexOf("lattice") >= 0) {
      return line.major
        ? `rgba(255,218,108,${0.70 * alphaScale})`
        : `rgba(117,205,255,${0.44 * alphaScale})`;
    }

    if (line.family.indexOf("cardinal") >= 0) return `rgba(255,228,143,${0.76 * alphaScale})`;
    if (line.family.indexOf("diagonal") >= 0) return `rgba(232,249,255,${0.30 * alphaScale})`;

    return `rgba(185,235,255,${0.46 * alphaScale})`;
  }

  function clearCanvas() {
    if (!state.ctx) return;
    state.ctx.clearRect(0, 0, state.width, state.height);
  }

  function drawAmbientField() {
    const ctx = state.ctx;
    const m = metrics();

    ctx.save();

    const glow = ctx.createRadialGradient(m.centerX, m.centerY, m.scale * 0.10, m.centerX, m.centerY, m.scale * 1.54);
    glow.addColorStop(0, "rgba(141,216,255,0.18)");
    glow.addColorStop(0.35, "rgba(36,120,255,0.08)");
    glow.addColorStop(0.72, "rgba(243,200,111,0.06)");
    glow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(m.centerX, m.centerY, m.scale * 1.54, 0, TAU);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.restore();
  }

  function drawFacets(alpha = 1) {
    const ctx = state.ctx;
    const sorted = state.facets.slice().sort((a, b) => facetDepth(a) - facetDepth(b));

    ctx.save();
    ctx.globalAlpha = alpha;

    for (const facet of sorted) {
      const a = projectSeat(facet.a);
      const b = projectSeat(facet.b);
      const c = projectSeat(facet.c);
      const d = projectSeat(facet.d);
      const depth = facetDepth(facet);

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(c.x, c.y);
      ctx.lineTo(d.x, d.y);
      ctx.closePath();

      ctx.fillStyle = colorForFacet(facet, depth);
      ctx.fill();

      if (facet.a.major || facet.b.major) {
        ctx.strokeStyle = "rgba(255,242,190,0.18)";
        ctx.lineWidth = Math.max(0.5, state.dpr * 0.44);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function drawLines(lines, alphaScale = 1, skipBack = false) {
    const ctx = state.ctx;
    const sorted = lines.slice().sort((a, b) => {
      const az = (rotatePoint(a.a).z + rotatePoint(a.b).z) / 2;
      const bz = (rotatePoint(b.a).z + rotatePoint(b.b).z) / 2;
      return az - bz;
    });

    ctx.save();

    for (const line of sorted) {
      const a = projectSeat(line.a);
      const b = projectSeat(line.b);

      if (skipBack && !a.frontFacing && !b.frontFacing) continue;

      const depth = clamp(((a.z + b.z) / 2 + 1.3) / 2.6, 0, 1);
      const pulse = line.family.indexOf("fibonacci") >= 0
        ? 0.86 + Math.sin(state.time * 1.9 + line.a.band * 0.43 + line.a.radial * 0.17) * 0.14
        : 1;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = edgeColor(line, alphaScale * clamp(0.58 + depth * 0.48, 0.22, 1.0) * pulse);
      ctx.lineWidth = Math.max(0.45, state.dpr * line.weight * (0.58 + depth * 0.35));
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawPoints(alphaScale = 1, majorOnly = false) {
    const ctx = state.ctx;

    ctx.save();

    for (const point of state.points) {
      if (majorOnly && !point.major) continue;

      const p = projectSeat(point.seat);
      const alpha = p.frontFacing
        ? (point.major ? 0.90 : point.secondary ? 0.62 : 0.40)
        : (point.major ? 0.18 : 0.08);

      const size = Math.max(1.2, point.size * state.dpr * p.perspective);

      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, TAU);
      ctx.fillStyle = point.major
        ? `rgba(255,224,116,${alpha * alphaScale})`
        : `rgba(141,216,255,${alpha * alphaScale})`;
      ctx.fill();
    }

    ctx.restore();
  }

  function drawWorldMemoryCurves(alpha = 1) {
    const ctx = state.ctx;
    const rings = [2, 4, 6, 8, 10, 12];

    ctx.save();
    ctx.globalAlpha = alpha;

    for (const band of rings) {
      ctx.beginPath();

      let started = false;

      for (let radial = 0; radial <= RADIAL_NODES; radial += 1) {
        const seat = state.seats[band * RADIAL_NODES + (radial % RADIAL_NODES)];
        const p = projectSeat(seat);

        if (!started) {
          ctx.moveTo(p.x, p.y);
          started = true;
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }

      ctx.strokeStyle = band % 4 === 0 ? "rgba(255,224,116,0.20)" : "rgba(141,216,255,0.15)";
      ctx.lineWidth = Math.max(0.55, state.dpr * 0.52);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawGlints() {
    const ctx = state.ctx;
    const m = metrics();
    const pulse = 0.5 + Math.sin(state.time * 1.8) * 0.5;

    ctx.save();
    ctx.translate(m.centerX, m.centerY);
    ctx.rotate(-0.52 + state.roll * 2);

    const glint = ctx.createLinearGradient(-m.scale * 0.9, 0, m.scale * 0.9, 0);
    glint.addColorStop(0, "rgba(255,255,255,0)");
    glint.addColorStop(0.46, `rgba(255,255,255,${0.18 + pulse * 0.24})`);
    glint.addColorStop(0.54, `rgba(255,230,150,${0.10 + pulse * 0.14})`);
    glint.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = glint;
    ctx.globalCompositeOperation = "screen";
    ctx.fillRect(-m.scale * 1.0, -m.scale * 0.42, m.scale * 2.0, m.scale * 0.18);

    ctx.restore();
  }

  function drawRim() {
    const ctx = state.ctx;
    const m = metrics();
    const seats = state.seats.filter((seat) => seat.band >= 6 && seat.band <= 8);
    const projected = seats.map(projectSeat);

    if (!projected.length) return;

    ctx.save();

    ctx.beginPath();
    projected.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();

    ctx.strokeStyle = "rgba(255,231,150,0.44)";
    ctx.lineWidth = Math.max(1, state.dpr * 1.08);
    ctx.stroke();

    const rim = ctx.createRadialGradient(m.centerX, m.centerY, m.scale * 0.82, m.centerX, m.centerY, m.scale * 1.28);
    rim.addColorStop(0, "rgba(255,228,143,0)");
    rim.addColorStop(0.74, "rgba(255,228,143,0.06)");
    rim.addColorStop(1, "rgba(141,216,255,0.12)");

    ctx.beginPath();
    ctx.arc(m.centerX, m.centerY, m.scale * 1.36, 0, TAU);
    ctx.fillStyle = rim;
    ctx.fill();

    ctx.restore();
  }

  function render() {
    if (!state.ctx || !state.geometryBuilt) return;

    clearCanvas();
    drawAmbientField();

    if (state.dimension === "behind") {
      drawLines(state.latticeLines, 0.36, false);
      drawLines(state.fibonacciLines, 0.32, false);
      drawPoints(0.40, false);
    }

    if (state.dimension === "full") {
      drawLines(state.latticeLines, 0.82, false);
      drawLines(state.fibonacciLines, 0.90, false);
      drawPoints(0.86, false);
      drawFacets(0.62);
      drawLines(state.edges, 0.50, true);
    } else if (state.dimension === "through" || state.lens === "lattice") {
      drawFacets(0.72);
      drawLines(state.latticeLines, 0.72, false);
      drawLines(state.fibonacciLines, 0.78, false);
      drawPoints(0.78, false);
      drawLines(state.edges, 0.42, true);
    } else {
      drawFacets(1);
      if (state.dimension === "memory") drawWorldMemoryCurves(1);
      drawLines(state.edges, 0.72, true);
      drawPoints(0.72, true);
    }

    drawGlints();
    drawRim();

    state.renderCount += 1;
    publishStatus("render");
  }

  function frame(timestamp) {
    if (state.stopped) return;

    const dt = state.lastFrame ? clamp((timestamp - state.lastFrame) / 1000, 0, 0.05) : 0;
    state.lastFrame = timestamp;
    state.time += dt;

    if (!state.dragging) {
      state.yaw += state.velocityYaw;
      state.pitch += state.velocityPitch;

      const damping = Math.pow(0.938, dt * 60);
      state.velocityYaw *= damping;
      state.velocityPitch *= damping;

      if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
      if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;

      if (state.velocityYaw === 0 && state.velocityPitch === 0) {
        state.yaw += Math.sin(state.time * 0.24) * dt * 0.016;
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
    const dpr = Math.max(1, Math.min(1.85, window.devicePixelRatio || 1));
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
        state.duplicateCanvasCount += 1;
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
    canvas.setAttribute("data-object", "G2_dimensional_gem_globe_proof_object");
    canvas.setAttribute("data-globe-inspired", "true");
    canvas.setAttribute("data-gem-governed", "true");
    canvas.setAttribute("data-planet", "false");

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
      state.velocityYaw = clamp(dx * 0.00235, -0.052, 0.052);
      state.velocityPitch = clamp(dy * 0.00155, -0.040, 0.040);

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
    window.addEventListener("orientationchange", () => setTimeout(resizeCanvas, 120), signal ? { signal, passive: true } : { passive: true });
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
    all("[data-diamond-dimension]").forEach((button) => {
      const active = button.dataset.diamondDimension === state.dimension;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.toggleAttribute("data-active", active);
    });

    const copy = DIMENSION_COPY[state.dimension] || DIMENSION_COPY.object;
    setText("[data-showroom-diamond-status]", copy.status);
    setText("[data-diamond-dimension-label]", copy.label);
  }

  function setLens(nextLens) {
    state.lens = nextLens === "lattice" ? "lattice" : "crystal";

    if (state.lens === "lattice" && state.dimension === "object") {
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
    state.dimension = Object.prototype.hasOwnProperty.call(DIMENSION_COPY, nextDimension)
      ? nextDimension
      : "object";

    if (state.dimension === "full" || state.dimension === "through") {
      state.lens = "lattice";
    }

    if (state.dimension === "object" || state.dimension === "memory" || state.dimension === "behind") {
      state.lens = "crystal";
    }

    setDataset("showroomDiamondG2Dimension", state.dimension);
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

  function bindFallbackControls() {
    all("[data-diamond-lens]").forEach((button) => {
      button.addEventListener("click", () => setLens(button.dataset.diamondLens), signal ? { signal } : false);
    });

    all("[data-diamond-dimension]").forEach((button) => {
      button.addEventListener("click", () => setDimension(button.dataset.diamondDimension), signal ? { signal } : false);
    });

    const resetButton = query("[data-showroom-diamond-reset]");
    if (resetButton) {
      resetButton.addEventListener("click", () => reset(), signal ? { signal } : false);
    }

    const inspectButton = query("[data-showroom-diamond-inspect]");
    if (inspectButton) {
      inspectButton.addEventListener("click", () => {
        const copy = DIMENSION_COPY[state.dimension] || DIMENSION_COPY.object;
        setText("[data-showroom-diamond-status]", `${copy.status} · ${LATTICE_SEATS} seats`);
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

      object: "G2_dimensional_gem_globe_proof_object",
      objectThesis: "world_compressed_into_a_gem",
      activeLens: state.lens,
      activeDimension: state.dimension,

      globeInspired: true,
      gemGoverned: true,
      planet: false,
      audraliaInheritance: false,
      planetTemplateInheritance: false,

      radialNodes: RADIAL_NODES,
      fibonacciBands: FIBONACCI_BANDS,
      latticeSeats: LATTICE_SEATS,
      seatCount: state.seats.length,
      facetCount: state.facets.length,
      edgeCount: state.edges.length,
      latticeLineCount: state.latticeLines.length,
      fibonacciLineCount: state.fibonacciLines.length,
      pointCount: state.points.length,

      dimensionalOptions: Object.keys(DIMENSION_COPY),
      crystalForm: true,
      latticeStructure: true,
      geometryBuilt: state.geometryBuilt,
      canvasReady: state.canvasReady,
      initialized: state.initialized,

      generatedImage: false,
      graphicBox: false,
      externalImageAsset: false,
      renderCount: state.renderCount,
      duplicateCanvasCount: state.duplicateCanvasCount,
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
    window.SHOWROOM_DIAMOND_G2_DIMENSIONAL_RENDERER_STATUS = payload;
    window.DGB_SHOWROOM_DIAMOND_G2_STATUS = payload;

    setDataset("showroomDiamondG2RendererContract", CONTRACT);
    setDataset("showroomDiamondG2RendererActive", "true");
    setDataset("showroomDiamondG2Object", "G2_dimensional_gem_globe_proof_object");
    setDataset("showroomDiamondG2Dimension", state.dimension);
    setDataset("showroomDiamondG2Lens", state.lens);
    setDataset("showroomDiamondG2GlobeInspired", "true");
    setDataset("showroomDiamondG2GemGoverned", "true");
    setDataset("showroomDiamondG2Planet", "false");
    setDataset("showroomDiamondG2RadialNodes", RADIAL_NODES);
    setDataset("showroomDiamondG2FibonacciBands", FIBONACCI_BANDS);
    setDataset("showroomDiamondG2LatticeSeats", LATTICE_SEATS);
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

  function announceReady() {
    try {
      window.dispatchEvent(new CustomEvent("showroom-diamond-g2-ready", { detail: status() }));
    } catch (_error) {}
  }

  function init() {
    try {
      exposeApi();

      state.stage = query("[data-showroom-diamond-stage]");

      if (!state.stage) {
        recordError("init", "Missing [data-showroom-diamond-stage]");
        state.initialized = true;
        publishStatus("missing-stage");
        return;
      }

      if (!enforceCanvas()) {
        recordError("init", "Canvas context unavailable");
        state.initialized = true;
        publishStatus("missing-canvas-context");
        return;
      }

      buildGeometry();
      bindPointer();
      setupResize();
      bindFallbackControls();
      updateLensCopy();
      updateDimensionControls();

      state.initialized = true;

      render();
      start();
      publishStatus("init-complete");
      announceReady();
    } catch (error) {
      recordError("init", error);
      state.initialized = true;
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
