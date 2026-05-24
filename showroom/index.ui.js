// TARGET FILE: /showroom/index.diamond.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_DIAMOND_G2_PHYSICAL_GEM_RESTRAINED_LATTICE_CORE_SPIRAL_RENDERER_TNT_v4
//
// Purpose:
// - Restore Object Only as a physical dimensional gem.
// - Remove dots / lattice / proof residue from Object Only.
// - Restrain internal lattice modes.
// - Add a core-origin Fibonacci spiral chronology inside the gem.
// - Preserve existing HTML and UI hooks.
// - Stay bounded to avoid freeze / truncation.
//
// Owns:
// - Diamond canvas rendering.
// - Physical gem form.
// - Visual variants.
// - Internal lattice.
// - Core-origin Fibonacci spiral.
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

  const CONTRACT = "SHOWROOM_DIAMOND_G2_PHYSICAL_GEM_RESTRAINED_LATTICE_CORE_SPIRAL_RENDERER_TNT_v4";
  const PREVIOUS = "SHOWROOM_DIAMOND_G2_VISUAL_VARIANTS_BOUNDED_RENDERER_TNT_v3";
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

  const DIMENSIONS = Object.freeze({
    object: {
      label: "Object Only",
      status: "Object Only active · physical faceted gem · no lattice"
    },
    memory: {
      label: "World Memory",
      status: "World Memory active · physical gem with subtle internal pressure"
    },
    behind: {
      label: "Lattice Behind",
      status: "Lattice Behind active · restrained proof field behind the gem"
    },
    through: {
      label: "Lattice Through",
      status: "Lattice Through active · internal lattice with core-origin Fibonacci spiral"
    },
    full: {
      label: "Full Proof",
      status: "Full Proof active · gem + restrained lattice + Fibonacci chronology"
    }
  });

  const LENS_COPY = Object.freeze({
    crystal: {
      title: "Crystal Form",
      route: "Crystal Form → physical G2 proof gem",
      copy:
        "Crystal Form restores the Diamond as a physical dimensional gem: cut planes, crown, girdle, pavilion, rim, and glints before any proof skeleton is exposed."
    },
    lattice: {
      title: "Lattice Structure",
      route: "Lattice Structure → restrained internal lattice + Fibonacci spiral",
      copy:
        "Lattice Structure reveals the internal proof skeleton through selected lines, selected nodes, and a core-origin Fibonacci spiral chronology."
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
    gemFacetLines: [],
    gemRimLines: [],
    memoryBands: [],
    latticeSupportLines: [],
    latticeCardinalLines: [],
    spiralNodes: [],
    spiralSegments: [],

    yaw: -0.62,
    pitch: -0.18,
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

  function now() {
    return typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
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
      0.255, 0.350, 0.480, 0.635,
      0.815, 1.000, 1.165, 1.225,
      1.125, 0.950, 0.765, 0.585,
      0.415, 0.250, 0.120, 0.035
    ];

    const heightProfile = [
      0.655, 0.590, 0.500, 0.390,
      0.270, 0.145, 0.030, -0.055,
      -0.140, -0.265, -0.405, -0.535,
      -0.650, -0.740, -0.810, -0.855
    ];

    const angle = (radial / RADIAL_NODES) * TAU;
    const fib = fibonacciWeight(band);
    const worldPressure = Math.sin((band / (FIBONACCI_BANDS - 1)) * Math.PI);

    const cut =
      1 +
      (radial % 2 === 0 ? 0.020 : -0.034) +
      (radial % 4 === 0 ? 0.055 : 0) +
      (radial % 4 === 2 ? -0.024 : 0);

    const radius = radiusProfile[band] * cut * (1 + worldPressure * 0.05) * (1 + (fib - 0.5) * 0.045);
    const zScale = 0.705 + Math.sin(band * 0.55 + radial * 0.21) * 0.020;

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

  function makePoint(x, y, z, family = "point") {
    return Object.freeze({ x, y, z, family });
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

    function line(a, b, family, weight = 1) {
      return Object.freeze({
        a,
        b,
        family,
        weight,
        major: Boolean(a.major || b.major),
        secondary: Boolean(a.secondary || b.secondary)
      });
    }

    const facets = [];
    const gemFacetLines = [];
    const gemRimLines = [];
    const memoryBands = [];
    const latticeSupportLines = [];
    const latticeCardinalLines = [];

    for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        const a = seat(band, radial);
        const b = seat(band, radial + 1);
        const c = seat(band + 1, radial + 1);
        const d = seat(band + 1, radial);

        facets.push(Object.freeze({ a, b, c, d, role: a.role }));

        if (radial % 2 === 0) {
          gemFacetLines.push(line(a, c, "gem-diagonal-cut", radial % 4 === 0 ? 1.15 : 0.72));
        }

        if (radial % 4 === 1 && band > 1 && band < 13) {
          gemFacetLines.push(line(b, d, "gem-counter-cut", 0.50));
        }
      }
    }

    for (let band = 0; band < FIBONACCI_BANDS; band += 1) {
      for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
        const a = seat(band, radial);
        const b = seat(band, radial + 1);

        const isRimBand = band === 1 || band === 6 || band === 7 || band === 8 || band === 14 || band === 15;
        const weight = isRimBand ? 1.55 : a.major ? 1.05 : 0.58;

        if (isRimBand) {
          gemRimLines.push(line(a, b, "gem-rim-ring", weight));
        } else if (band % 2 === 0 || radial % 4 === 0) {
          gemFacetLines.push(line(a, b, "gem-facet-ring", weight));
        }
      }
    }

    for (let radial = 0; radial < RADIAL_NODES; radial += 1) {
      for (let band = 0; band < FIBONACCI_BANDS - 1; band += 1) {
        const a = seat(band, radial);
        const b = seat(band + 1, radial);

        if (radial % 4 === 0) {
          gemRimLines.push(line(a, b, "gem-cardinal-cut", 1.20));
        } else if (radial % 2 === 0 && band % 2 === 0) {
          gemFacetLines.push(line(a, b, "gem-spine-cut", 0.54));
        }
      }
    }

    [3, 5, 7, 9, 11, 13].forEach((band) => {
      const ring = [];

      for (let radial = 0; radial <= RADIAL_NODES; radial += 1) {
        ring.push(seat(band, radial % RADIAL_NODES));
      }

      memoryBands.push(Object.freeze({
        band,
        points: Object.freeze(ring),
        major: band === 7 || band === 11
      }));
    });

    [4, 7, 10, 13].forEach((band) => {
      for (let radial = 0; radial < RADIAL_NODES; radial += 2) {
        latticeSupportLines.push(line(seat(band, radial), seat(band, radial + 2), "lattice-selected-ring", band === 7 ? 1.0 : 0.64));
      }
    });

    [0, 4, 8, 12].forEach((radial) => {
      for (let band = 3; band < 14; band += 2) {
        latticeCardinalLines.push(line(seat(band, radial), seat(Math.min(14, band + 2), radial), "lattice-cardinal-support", 0.90));
      }
    });

    [2, 6, 10, 14].forEach((radial) => {
      for (let band = 4; band < 12; band += 3) {
        latticeSupportLines.push(line(seat(band, radial), seat(Math.min(14, band + 2), radial + 1), "lattice-secondary-support", 0.46));
      }
    });

    const spiralNodes = [
      makePoint(0, -0.035, 0, "spiral-core"),
      seat(7, 0),
      seat(7, 1),
      seat(8, 2),
      seat(9, 4),
      seat(10, 7),
      seat(12, 12),
      seat(14, 9)
    ];

    const spiralSegments = [];

    for (let i = 0; i < spiralNodes.length - 1; i += 1) {
      spiralSegments.push(Object.freeze({
        a: spiralNodes[i],
        b: spiralNodes[i + 1],
        step: i === 0 ? "core" : String([1, 1, 2, 3, 5, 8, 13][i - 1] || 13),
        weight: i === 0 ? 1.00 : 0.82 + i * 0.08
      }));
    }

    state.seats = rings.flat();
    state.facets = facets;
    state.gemFacetLines = gemFacetLines;
    state.gemRimLines = gemRimLines;
    state.memoryBands = memoryBands;
    state.latticeSupportLines = latticeSupportLines;
    state.latticeCardinalLines = latticeCardinalLines;
    state.spiralNodes = spiralNodes;
    state.spiralSegments = spiralSegments;
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
      scale: minSide * (cssWidth < 680 ? 0.385 : 0.415),
      cameraDistance: 4.55
    };
  }

  function projectPoint(point) {
    const m = metrics();
    const r = rotatePoint(point);
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

    glow.addColorStop(0, `rgba(141,216,255,${0.08 + level * 0.07})`);
    glow.addColorStop(0.38, `rgba(36,120,255,${0.04 + level * 0.05})`);
    glow.addColorStop(0.76, `rgba(243,200,111,${0.030 + level * 0.030})`);
    glow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(m.centerX, m.centerY, m.scale * 1.65, 0, TAU);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.restore();
  }

  function facetColor(facet, depth, alpha) {
    const light = clamp(0.70 + depth * 0.28, 0.55, 1.08);

    let r = 120;
    let g = 205;
    let b = 255;

    if (facet.role === "table") {
      r = 238;
      g = 252;
      b = 255;
    } else if (facet.role === "crown") {
      r = 132;
      g = 218;
      b = 255;
    } else if (facet.role === "girdle") {
      r = 255;
      g = 214;
      b = 118;
    } else if (facet.role === "pavilion") {
      r = 55;
      g = 112;
      b = 224;
    } else {
      r = 35;
      g = 70;
      b = 140;
    }

    return `rgba(${Math.round(r * light)},${Math.round(g * light)},${Math.round(b * light)},${alpha})`;
  }

  function drawFacets(alpha) {
    const ctx = state.ctx;

    ctx.save();

    for (let i = 0; i < state.facets.length; i += 1) {
      const facet = state.facets[i];
      const a = projectPoint(facet.a);
      const b = projectPoint(facet.b);
      const c = projectPoint(facet.c);
      const d = projectPoint(facet.d);
      const depth = clamp(((a.z + b.z + c.z + d.z) / 4 + 1.35) / 2.7, 0, 1);

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(c.x, c.y);
      ctx.lineTo(d.x, d.y);
      ctx.closePath();

      ctx.fillStyle = facetColor(facet, depth, alpha);
      ctx.fill();

      if (facet.a.major || facet.b.major) {
        ctx.strokeStyle = `rgba(255,242,190,${0.11 * alpha})`;
        ctx.lineWidth = Math.max(0.45, state.dpr * 0.38);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function gemLineColor(line, alpha) {
    if (line.family.indexOf("rim") >= 0) return `rgba(255,231,150,${0.70 * alpha})`;
    if (line.family.indexOf("cardinal") >= 0) return `rgba(255,226,132,${0.58 * alpha})`;
    if (line.family.indexOf("diagonal") >= 0) return `rgba(236,250,255,${0.42 * alpha})`;
    return `rgba(190,235,255,${0.30 * alpha})`;
  }

  function latticeLineColor(line, alpha) {
    if (line.family.indexOf("cardinal") >= 0) return `rgba(255,220,105,${0.58 * alpha})`;
    if (line.family.indexOf("selected-ring") >= 0) return `rgba(120,210,255,${0.42 * alpha})`;
    return `rgba(150,220,255,${0.24 * alpha})`;
  }

  function drawLines(lines, colorFn, alpha, majorOnly = false) {
    const ctx = state.ctx;

    ctx.save();

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (majorOnly && !line.major) continue;

      const a = projectPoint(line.a);
      const b = projectPoint(line.b);
      const depth = clamp(((a.z + b.z) / 2 + 1.35) / 2.7, 0, 1);

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = colorFn(line, alpha * (0.68 + depth * 0.42));
      ctx.lineWidth = Math.max(0.45, state.dpr * line.weight);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawMemoryBands(alpha) {
    const ctx = state.ctx;
    const pulse = 0.5 + Math.sin(state.time * 1.35) * 0.5;

    ctx.save();

    for (let i = 0; i < state.memoryBands.length; i += 1) {
      const band = state.memoryBands[i];

      ctx.beginPath();

      for (let j = 0; j < band.points.length; j += 1) {
        const p = projectPoint(band.points[j]);
        if (j === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }

      ctx.strokeStyle = band.major
        ? `rgba(255,224,116,${alpha * (0.22 + pulse * 0.10)})`
        : `rgba(141,216,255,${alpha * (0.16 + pulse * 0.07)})`;
      ctx.lineWidth = Math.max(0.65, state.dpr * (band.major ? 1.00 : 0.68));
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawCoreGlow(alpha) {
    const ctx = state.ctx;
    const core = projectPoint(makePoint(0, -0.035, 0, "core"));
    const pulse = 0.5 + Math.sin(state.time * 1.4) * 0.5;

    ctx.save();

    const r = Math.max(8, 18 * state.dpr * core.perspective);
    const glow = ctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, r * 2.8);

    glow.addColorStop(0, `rgba(255,232,163,${alpha * (0.22 + pulse * 0.10)})`);
    glow.addColorStop(0.38, `rgba(141,216,255,${alpha * 0.12})`);
    glow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(core.x, core.y, r * 2.8, 0, TAU);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.restore();
  }

  function drawBackgroundLattice(alpha) {
    const ctx = state.ctx;
    const m = metrics();

    ctx.save();
    ctx.translate(m.centerX, m.centerY);
    ctx.rotate(-0.18);

    for (let i = 1; i <= 4; i += 1) {
      ctx.beginPath();
      ctx.ellipse(0, 0, m.scale * (0.32 + i * 0.17), m.scale * (0.13 + i * 0.075), 0, 0, TAU);
      ctx.strokeStyle = i % 2 === 0
        ? `rgba(255,220,103,${alpha * 0.12})`
        : `rgba(141,216,255,${alpha * 0.14})`;
      ctx.lineWidth = Math.max(0.55, state.dpr * 0.62);
      ctx.stroke();
    }

    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * TAU;
      const x = Math.cos(a) * m.scale * 1.03;
      const y = Math.sin(a) * m.scale * 0.47;

      ctx.beginPath();
      ctx.moveTo(-x, -y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = i % 2 === 0
        ? `rgba(255,220,103,${alpha * 0.14})`
        : `rgba(141,216,255,${alpha * 0.08})`;
      ctx.lineWidth = Math.max(0.45, state.dpr * (i % 2 === 0 ? 0.72 : 0.44));
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSpiral(alpha, showNodes) {
    const ctx = state.ctx;
    const pulse = 0.5 + Math.sin(state.time * 1.55) * 0.5;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let i = 0; i < state.spiralSegments.length; i += 1) {
      const segment = state.spiralSegments[i];
      const a = projectPoint(segment.a);
      const b = projectPoint(segment.b);

      const cx = (a.x + b.x) / 2 + (b.y - a.y) * 0.12;
      const cy = (a.y + b.y) / 2 - (b.x - a.x) * 0.12;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(cx, cy, b.x, b.y);

      ctx.strokeStyle = i < 2
        ? `rgba(255,235,164,${alpha * (0.55 + pulse * 0.18)})`
        : `rgba(255,215,96,${alpha * (0.62 + pulse * 0.14)})`;
      ctx.lineWidth = Math.max(1.0, state.dpr * segment.weight * (i < 2 ? 1.10 : 1.28));
      ctx.stroke();
    }

    if (showNodes) {
      for (let i = 0; i < state.spiralNodes.length; i += 1) {
        const p = projectPoint(state.spiralNodes[i]);
        const size = Math.max(2.4, state.dpr * (i === 0 ? 5.8 : 3.4 + i * 0.22) * p.perspective);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, TAU);
        ctx.fillStyle = i === 0
          ? `rgba(255,239,174,${alpha * 0.86})`
          : `rgba(141,216,255,${alpha * 0.62})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 1.9, 0, TAU);
        ctx.strokeStyle = i === 0
          ? `rgba(255,239,174,${alpha * 0.28})`
          : `rgba(141,216,255,${alpha * 0.18})`;
        ctx.lineWidth = Math.max(0.5, state.dpr * 0.55);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function drawRim(alpha) {
    drawLines(state.gemRimLines, gemLineColor, alpha, false);
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
    glint.addColorStop(0.48, `rgba(255,255,255,${alpha * (0.14 + pulse * 0.21)})`);
    glint.addColorStop(0.56, `rgba(255,230,150,${alpha * (0.08 + pulse * 0.12)})`);
    glint.addColorStop(1, "rgba(255,255,255,0)");

    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = glint;
    ctx.fillRect(-m.scale, -m.scale * 0.43, m.scale * 2, m.scale * 0.18);

    ctx.restore();
  }

  function render() {
    if (!state.ctx || !state.geometryBuilt) return;

    clear();

    if (state.dimension === "object") {
      drawAmbient(0.48);
      drawFacets(0.98);
      drawLines(state.gemFacetLines, gemLineColor, 0.72, false);
      drawRim(1.00);
      drawGlints(1.00);
    } else if (state.dimension === "memory") {
      drawAmbient(0.62);
      drawCoreGlow(0.75);
      drawFacets(0.92);
      drawMemoryBands(1.00);
      drawLines(state.gemFacetLines, gemLineColor, 0.58, false);
      drawRim(0.88);
      drawGlints(0.74);
    } else if (state.dimension === "behind") {
      drawAmbient(0.62);
      drawBackgroundLattice(0.92);
      drawFacets(0.96);
      drawLines(state.gemFacetLines, gemLineColor, 0.62, false);
      drawRim(1.00);
      drawGlints(0.74);
    } else if (state.dimension === "through") {
      drawAmbient(0.76);
      drawFacets(0.64);
      drawLines(state.latticeSupportLines, latticeLineColor, 0.66, false);
      drawLines(state.latticeCardinalLines, latticeLineColor, 0.82, false);
      drawSpiral(0.95, true);
      drawLines(state.gemFacetLines, gemLineColor, 0.32, true);
      drawRim(0.76);
      drawGlints(0.38);
    } else {
      drawAmbient(0.88);
      drawBackgroundLattice(0.42);
      drawCoreGlow(0.62);
      drawFacets(0.68);
      drawMemoryBands(0.52);
      drawLines(state.latticeSupportLines, latticeLineColor, 0.76, false);
      drawLines(state.latticeCardinalLines, latticeLineColor, 0.94, false);
      drawSpiral(1.12, true);
      drawLines(state.gemFacetLines, gemLineColor, 0.40, true);
      drawRim(0.90);
      drawGlints(0.42);
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
        state.yaw += Math.sin(state.time * 0.24) * dt * 0.012;
      }
    }

    state.pitch = clamp(state.pitch, -0.92, 0.74);
    state.roll = Math.sin(state.time * 0.18) * 0.014;

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
    canvas.setAttribute("data-object-only", "physical-gem-no-dots-no-lattice");
    canvas.setAttribute("data-core-origin-fibonacci-spiral", "active-in-lattice-through-and-full-proof");
    canvas.setAttribute("data-restrained-lattice", "true");
    canvas.setAttribute("data-freeze-guard", "bounded-renderer-no-per-frame-status-publish");

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
    state.yaw = -0.62;
    state.pitch = -0.18;
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
        setText(
          "[data-showroom-diamond-status]",
          `${copy.status} · 16 × 16 / 256 seats · physical gem / restrained lattice renderer`
        );
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

      object: "G2_physical_gem_restrained_lattice_core_spiral",
      activeLens: state.lens,
      activeDimension: state.dimension,
      variants: Object.keys(DIMENSIONS),

      objectOnlyPhysicalGem: true,
      objectOnlyDots: false,
      objectOnlyLattice: false,
      objectOnlySpiral: false,

      restrainedLattice: true,
      coreOriginFibonacciSpiral: true,
      fibonacciSequenceVisibleInLattice: "1_1_2_3_5_8_13",

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
      gemFacetLineCount: state.gemFacetLines.length,
      gemRimLineCount: state.gemRimLines.length,
      memoryBandCount: state.memoryBands.length,
      latticeSupportLineCount: state.latticeSupportLines.length,
      latticeCardinalLineCount: state.latticeCardinalLines.length,
      spiralNodeCount: state.spiralNodes.length,
      spiralSegmentCount: state.spiralSegments.length,

      freezeGuard: "bounded_rendering_no_per_frame_status_publish",
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
    window.SHOWROOM_DIAMOND_G2_PHYSICAL_GEM_CORE_SPIRAL_STATUS = payload;
    window.DGB_SHOWROOM_DIAMOND_G2_STATUS = payload;

    setDataset("showroomDiamondG2RendererContract", CONTRACT);
    setDataset("showroomDiamondG2RendererActive", "true");
    setDataset("showroomDiamondG2Dimension", state.dimension);
    setDataset("showroomDiamondG2Lens", state.lens);
    setDataset("showroomDiamondG2ObjectOnlyPhysicalGem", "true");
    setDataset("showroomDiamondG2ObjectOnlyDots", "false");
    setDataset("showroomDiamondG2ObjectOnlyLattice", "false");
    setDataset("showroomDiamondG2RestrainedLattice", "true");
    setDataset("showroomDiamondG2CoreOriginFibonacciSpiral", "true");
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
      recordError("init", error);
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
