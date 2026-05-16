// /showroom/index.js
// TNT FULL-FILE REPLACEMENT
// SHOWROOM_DUAL_LENS_DIAMOND_RENDER_TNT_v2
// Paired HTML: SHOWROOM_DUAL_LENS_DIAMOND_EDUCATIONAL_LAUNCHPAD_TNT_v1
// Scope: active /showroom/ Diamond renderer only.
// Purpose:
// - Crystal Form renders a true diamond silhouette, not the lattice silhouette.
// - Lattice Structure renders the 16-point compass / 256-lattice structure as the science lens.
// - The two lenses are related, but visually distinct.
// - Crystal Form is the public object. Lattice Structure is the structural explanation.
// - No generated image. No graphic box. No legacy Globe / Planet One / Demo Universe inheritance.

const SHOWROOM_DIAMOND_STATE = Object.freeze({
  contract: "SHOWROOM_DUAL_LENS_DIAMOND_RENDER_TNT_v2",
  pairedHtmlContract: "SHOWROOM_DUAL_LENS_DIAMOND_EDUCATIONAL_LAUNCHPAD_TNT_v1",
  route: "/showroom/",
  role: "showroom-dual-lens-cover-object",
  diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
  touchGlide: true,
  inspectionControl: "solid-body-camera-view",
  geometryMutableByTouch: false,
  defaultLens: "crystal",
  secondaryLens: "lattice",
  lensRule: "toggle-changes-inspection-lens-not-object-identity",
  visibleRadialMetric: 16,
  latticeStates: 256,
  crystalFormSilhouette: "true-cut-diamond-body",
  latticeFormSilhouette: "structural-compass-lattice-field",
  crystalAndLatticeAreVisuallyDistinct: true,
  generatedImage: false,
  graphicBox: false,
  earthRecord: false,
  legacyGlobeInheritance: false,
  publicReceiptsVisible: false
});

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;
const RADIAL_POINTS = 16;
const LATTICE_STATES = 256;

const LENS_COPY = Object.freeze({
  crystal: {
    title: "Crystal Form",
    route: "Crystal Form → finished Crown Cut Diamond · true crystal silhouette",
    copy: "This view shows the finished Crown Cut Diamond as a crystal body: table, crown, faceted girdle, pavilion, culet, light, and touch inspection. This is the public object. It proves the site can render interactive 3D content with a fixed form instead of a flat graphic."
  },
  lattice: {
    title: "Lattice Structure",
    route: "Lattice Structure → 16-point compass geometry · 256 lattice logic",
    copy: "This view reveals the structural logic beneath the Diamond. The 16-point compass metric organizes the visible geometry, while the 256 lattice represents the deeper address system behind the form. This is not a separate object. It is the same Diamond viewed through its underlying structure."
  }
});

const state = {
  lens: "crystal",
  yaw: 0.18,
  pitch: -0.10,
  roll: 0,
  velocityYaw: 0,
  velocityPitch: 0,
  velocityRoll: 0,
  sparklePhase: 0,
  dragging: false,
  pointerX: 0,
  pointerY: 0,
  lastTap: 0,
  lastTime: 0,
  raf: 0,
  dpr: 1,
  canvasReady: false
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function seededUnit(index, salt) {
  return ((Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1 + 1) % 1;
}

function rgba(color, alpha) {
  return `rgba(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])}, ${alpha})`;
}

function resizeCanvas(canvas) {
  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.max(320, Math.floor((box.width || 640) * dpr));
  const height = Math.max(500, Math.floor((box.height || 720) * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  state.dpr = dpr;
}

function project2D(point, cx, cy, scale, options = {}) {
  const yawSkew = options.yawSkew ?? Math.sin(state.yaw) * 0.10;
  const pitchLift = options.pitchLift ?? Math.sin(state.pitch) * 0.06;
  const roll = options.roll ?? state.roll * 0.12;

  let x = point.x + point.y * yawSkew;
  let y = point.y + point.x * roll + pitchLift;

  return {
    x: cx + x * scale,
    y: cy + y * scale,
    source: point
  };
}

function pathPolygon(ctx, points) {
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
}

function drawBackground(ctx, width, height, lens) {
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, lens === "lattice" ? "rgba(2, 5, 15, 1)" : "rgba(1, 5, 14, 1)");
  bg.addColorStop(0.48, lens === "lattice" ? "rgba(7, 12, 34, 0.99)" : "rgba(5, 15, 32, 0.99)");
  bg.addColorStop(1, "rgba(1, 4, 10, 1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const halo = ctx.createRadialGradient(
    width * 0.5,
    height * 0.40,
    width * 0.04,
    width * 0.5,
    height * 0.43,
    width * 0.62
  );

  halo.addColorStop(0, lens === "lattice" ? "rgba(198, 166, 255, 0.20)" : "rgba(244, 250, 255, 0.23)");
  halo.addColorStop(0.30, "rgba(118, 168, 225, 0.13)");
  halo.addColorStop(0.56, "rgba(244, 207, 131, 0.052)");
  halo.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);

  const velvet = ctx.createRadialGradient(
    width * 0.5,
    height * 0.54,
    width * 0.10,
    width * 0.5,
    height * 0.57,
    width * 0.80
  );
  velvet.addColorStop(0, "rgba(30, 45, 70, 0.08)");
  velvet.addColorStop(0.64, "rgba(0,0,0,0)");
  velvet.addColorStop(1, "rgba(0,0,0,0.32)");
  ctx.fillStyle = velvet;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(ctx, width, height) {
  ctx.save();

  for (let i = 0; i < 56; i += 1) {
    const x = seededUnit(i, 1) * width;
    const y = seededUnit(i, 2) * height;
    const alpha = 0.06 + seededUnit(i, 3) * 0.16;
    const size = i % 17 === 0 ? 5.4 : i % 7 === 0 ? 2.6 : 1.0;

    ctx.strokeStyle = `rgba(235, 244, 255, ${alpha})`;
    ctx.lineWidth = Math.max(1, width * 0.00072);
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  ctx.restore();
}

function crystalPoints(cx, cy, scale) {
  const skew = Math.sin(state.yaw) * 0.10;
  const lift = Math.sin(state.pitch) * 0.045;

  const p = (name, x, y) => ({
    name,
    x: cx + (x + y * skew) * scale,
    y: cy + (y + lift + x * state.roll * 0.10) * scale
  });

  return Object.freeze({
    tableL: p("tableL", -0.34, -0.78),
    tableCL: p("tableCL", -0.12, -0.81),
    tableC: p("tableC", 0, -0.825),
    tableCR: p("tableCR", 0.12, -0.81),
    tableR: p("tableR", 0.34, -0.78),

    crownL2: p("crownL2", -0.58, -0.62),
    crownL1: p("crownL1", -0.76, -0.43),
    crownR1: p("crownR1", 0.76, -0.43),
    crownR2: p("crownR2", 0.58, -0.62),

    girdleL: p("girdleL", -1.08, -0.18),
    girdleL2: p("girdleL2", -1.00, -0.03),
    girdleR2: p("girdleR2", 1.00, -0.03),
    girdleR: p("girdleR", 1.08, -0.18),

    pavilionL1: p("pavilionL1", -0.78, 0.18),
    pavilionL2: p("pavilionL2", -0.42, 0.52),
    pavilionR2: p("pavilionR2", 0.42, 0.52),
    pavilionR1: p("pavilionR1", 0.78, 0.18),

    culet: p("culet", 0, 0.92),
    culetL: p("culetL", -0.055, 0.88),
    culetR: p("culetR", 0.055, 0.88)
  });
}

function makeGradient(ctx, a, b, stops) {
  const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
  stops.forEach(([pos, color]) => gradient.addColorStop(pos, color));
  return gradient;
}

function fillFacet(ctx, points, fill, stroke = "rgba(235,248,255,0.42)", lineWidth = 1) {
  pathPolygon(ctx, points);
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(lineWidth, state.dpr * 0.78);
  ctx.lineJoin = "miter";
  ctx.fill();
  ctx.stroke();
}

function drawCrystalForm(ctx, width, height) {
  const cx = width * 0.5;
  const cy = height * 0.405;
  const scale = Math.min(width * 0.36, height * 0.37);
  const p = crystalPoints(cx, cy, scale);

  ctx.save();

  const aura = ctx.createRadialGradient(cx, cy, scale * 0.12, cx, cy + scale * 0.04, scale * 1.7);
  aura.addColorStop(0, "rgba(255,255,255,0.18)");
  aura.addColorStop(0.32, "rgba(141,216,255,0.10)");
  aura.addColorStop(0.64, "rgba(244,207,131,0.045)");
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  const outer = [
    p.tableL,
    p.tableCL,
    p.tableC,
    p.tableCR,
    p.tableR,
    p.crownR2,
    p.crownR1,
    p.girdleR,
    p.girdleR2,
    p.pavilionR1,
    p.pavilionR2,
    p.culetR,
    p.culet,
    p.culetL,
    p.pavilionL2,
    p.pavilionL1,
    p.girdleL2,
    p.girdleL,
    p.crownL1,
    p.crownL2
  ];

  const bodyGradient = makeGradient(ctx, p.tableC, p.culet, [
    [0, "rgba(255,255,255,0.78)"],
    [0.22, "rgba(205,232,255,0.58)"],
    [0.48, "rgba(92,138,198,0.42)"],
    [0.72, "rgba(22,42,76,0.60)"],
    [1, "rgba(8,18,38,0.72)"]
  ]);

  fillFacet(ctx, outer, bodyGradient, "rgba(235,248,255,0.36)", 1.1 * state.dpr);

  fillFacet(ctx, [p.tableL, p.tableCL, p.tableC, p.tableCR, p.tableR, p.crownR2, p.crownL2], makeGradient(ctx, p.tableC, p.crownL2, [
    [0, "rgba(255,255,255,0.82)"],
    [0.42, "rgba(212,236,255,0.50)"],
    [1, "rgba(94,136,192,0.26)"]
  ]), "rgba(255,255,255,0.52)", 1.0 * state.dpr);

  fillFacet(ctx, [p.tableL, p.crownL2, p.crownL1, p.girdleL, p.girdleL2, p.pavilionL1, p.pavilionL2, p.culetL, p.culet, p.tableC], makeGradient(ctx, p.tableL, p.culet, [
    [0, "rgba(236,247,255,0.48)"],
    [0.32, "rgba(104,150,210,0.36)"],
    [0.70, "rgba(20,36,70,0.54)"],
    [1, "rgba(255,220,142,0.16)"]
  ]), "rgba(205,232,255,0.30)", 0.86 * state.dpr);

  fillFacet(ctx, [p.tableR, p.crownR2, p.crownR1, p.girdleR, p.girdleR2, p.pavilionR1, p.pavilionR2, p.culetR, p.culet, p.tableC], makeGradient(ctx, p.tableR, p.culet, [
    [0, "rgba(255,255,255,0.58)"],
    [0.26, "rgba(205,232,255,0.42)"],
    [0.62, "rgba(70,116,182,0.38)"],
    [1, "rgba(10,22,48,0.50)"]
  ]), "rgba(235,248,255,0.32)", 0.86 * state.dpr);

  fillFacet(ctx, [p.girdleL, p.girdleR, p.girdleR2, p.girdleL2], makeGradient(ctx, p.girdleL, p.girdleR, [
    [0, "rgba(255,255,255,0.38)"],
    [0.38, "rgba(160,210,255,0.30)"],
    [0.64, "rgba(244,207,131,0.20)"],
    [1, "rgba(255,255,255,0.28)"]
  ]), "rgba(255,255,255,0.58)", 1.26 * state.dpr);

  fillFacet(ctx, [p.pavilionL1, p.pavilionR1, p.pavilionR2, p.culetR, p.culet, p.culetL, p.pavilionL2], makeGradient(ctx, p.pavilionL1, p.culet, [
    [0, "rgba(104,150,210,0.34)"],
    [0.45, "rgba(32,58,100,0.50)"],
    [0.82, "rgba(12,24,50,0.68)"],
    [1, "rgba(255,220,142,0.18)"]
  ]), "rgba(190,225,255,0.34)", 0.92 * state.dpr);

  drawCrystalFacetLines(ctx, p, width, scale);
  drawCrystalFire(ctx, p, width, scale);
  drawCrystalSparkles(ctx, p, width, scale);

  const shadow = ctx.createRadialGradient(cx, p.culet.y + scale * 0.15, scale * 0.02, cx, p.culet.y + scale * 0.15, scale * 0.42);
  shadow.addColorStop(0, "rgba(244,207,131,0.12)");
  shadow.addColorStop(0.38, "rgba(92,132,172,0.10)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(cx, p.culet.y + scale * 0.15, scale * 0.34, scale * 0.052, 0, 0, TAU);
  ctx.fill();

  ctx.restore();
}

function drawCrystalFacetLines(ctx, p, width, scale) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.lineJoin = "miter";
  ctx.lineCap = "butt";

  const major = "rgba(255,255,255,0.62)";
  const minor = "rgba(205,232,255,0.30)";
  const gold = "rgba(244,207,131,0.28)";

  function line(a, b, color, widthMod = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(0.9, scale * 0.0042 * widthMod);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  line(p.tableL, p.tableR, major, 1.1);
  line(p.girdleL, p.girdleR, major, 1.2);
  line(p.girdleL2, p.girdleR2, minor, 0.8);

  line(p.tableL, p.girdleL, minor, 0.72);
  line(p.tableR, p.girdleR, minor, 0.72);
  line(p.tableC, p.girdleL2, minor, 0.7);
  line(p.tableC, p.girdleR2, minor, 0.7);

  line(p.girdleL, p.culet, minor, 0.92);
  line(p.girdleR, p.culet, minor, 0.92);
  line(p.girdleL2, p.pavilionR2, "rgba(198,166,255,0.20)", 0.65);
  line(p.girdleR2, p.pavilionL2, "rgba(198,166,255,0.20)", 0.65);

  line(p.tableC, p.culet, gold, 0.65);
  line(p.crownL2, p.pavilionR1, "rgba(255,255,255,0.18)", 0.55);
  line(p.crownR2, p.pavilionL1, "rgba(255,255,255,0.18)", 0.55);

  ctx.restore();
}

function drawCrystalFire(ctx, p, width, scale) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const pairs = [
    [p.tableL, p.pavilionR1, [141, 216, 255], 0.20],
    [p.tableR, p.pavilionL1, [255, 220, 142], 0.18],
    [p.crownL1, p.culetR, [198, 166, 255], 0.16],
    [p.crownR1, p.culetL, [255, 255, 255], 0.14]
  ];

  pairs.forEach(([a, b, color, alpha], index) => {
    const pulse = 0.72 + 0.28 * Math.sin(state.sparklePhase * 1.35 + index * PHI);
    const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.50, rgba(color, alpha * pulse));
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(1, scale * 0.009);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  ctx.restore();
}

function drawStarGlint(ctx, x, y, radius, alpha = 1) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const outer = radius * state.dpr;
  const inner = outer * 0.32;

  const glow = ctx.createRadialGradient(x, y, 0, x, y, outer * 2.35);
  glow.addColorStop(0, `rgba(255, 255, 255, ${0.70 * alpha})`);
  glow.addColorStop(0.20, `rgba(160, 215, 255, ${0.26 * alpha})`);
  glow.addColorStop(0.54, `rgba(244, 207, 131, ${0.08 * alpha})`);
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, outer * 2.35, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = `rgba(255, 255, 255, ${0.86 * alpha})`;
  ctx.lineWidth = Math.max(1, outer * 0.052);

  ctx.beginPath();
  ctx.moveTo(x - outer, y);
  ctx.lineTo(x + outer, y);
  ctx.moveTo(x, y - outer);
  ctx.lineTo(x, y + outer);
  ctx.stroke();

  ctx.strokeStyle = `rgba(190, 225, 255, ${0.50 * alpha})`;
  ctx.beginPath();
  ctx.moveTo(x - inner, y - inner);
  ctx.lineTo(x + inner, y + inner);
  ctx.moveTo(x + inner, y - inner);
  ctx.lineTo(x - inner, y + inner);
  ctx.stroke();

  ctx.restore();
}

function drawCrystalSparkles(ctx, p, width, scale) {
  const candidates = [
    p.tableC,
    p.tableL,
    p.tableR,
    p.girdleL,
    p.girdleR,
    p.pavilionL2,
    p.pavilionR2,
    p.culet
  ];

  candidates.forEach((point, index) => {
    const pulse = 0.5 + 0.5 * Math.sin(index * PHI + state.sparklePhase * 1.9);
    const threshold = seededUnit(index, 44);
    if (pulse + threshold < 0.72) return;
    drawStarGlint(ctx, point.x, point.y, index < 3 ? 9 : 7, clamp(pulse * 0.62, 0.18, 0.62));
  });
}

function drawLatticeStructure(ctx, width, height) {
  const cx = width * 0.5;
  const cy = height * 0.405;
  const scale = Math.min(width * 0.34, height * 0.36);

  ctx.save();

  const aura = ctx.createRadialGradient(cx, cy, scale * 0.10, cx, cy, scale * 1.72);
  aura.addColorStop(0, "rgba(198,166,255,0.18)");
  aura.addColorStop(0.32, "rgba(141,216,255,0.10)");
  aura.addColorStop(0.70, "rgba(244,207,131,0.035)");
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  const rings = [
    { name: "table-address", rx: 0.26, ry: 0.14, y: -0.62, alpha: 0.62 },
    { name: "crown-address", rx: 0.58, ry: 0.24, y: -0.42, alpha: 0.46 },
    { name: "girdle-address", rx: 1.00, ry: 0.40, y: -0.12, alpha: 0.72 },
    { name: "pavilion-address", rx: 0.66, ry: 0.30, y: 0.28, alpha: 0.40 },
    { name: "culet-address", rx: 0.18, ry: 0.09, y: 0.66, alpha: 0.56 }
  ];

  const projectedRings = rings.map((ring, ringIndex) => {
    const points = [];

    for (let i = 0; i < RADIAL_POINTS; i += 1) {
      const angle = (i / RADIAL_POINTS) * TAU + (ringIndex % 2 ? TAU / 32 : 0);
      const pulse = 1 + Math.sin(i * PHI + state.sparklePhase * 0.55) * 0.012;
      const x = Math.cos(angle) * ring.rx * pulse;
      const y = ring.y + Math.sin(angle) * ring.ry * pulse;

      points.push({
        x: cx + (x + y * Math.sin(state.yaw) * 0.08) * scale,
        y: cy + y * scale,
        ring,
        index: i,
        angle
      });
    }

    return points;
  });

  ctx.globalCompositeOperation = "screen";
  ctx.lineJoin = "miter";

  projectedRings.forEach((points, ringIndex) => {
    ctx.strokeStyle = `rgba(244,250,255,${rings[ringIndex].alpha})`;
    ctx.lineWidth = Math.max(0.9, scale * (ringIndex === 2 ? 0.006 : 0.004));
    ctx.beginPath();

    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.closePath();
    ctx.stroke();
  });

  for (let i = 0; i < RADIAL_POINTS; i += 1) {
    const major = i % 4 === 0;
    const color = major ? "244,207,131" : "141,216,255";
    const alpha = major ? 0.62 : 0.30;
    const lineWidth = Math.max(0.8, scale * (major ? 0.0052 : 0.0032));

    ctx.strokeStyle = `rgba(${color},${alpha})`;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    projectedRings.forEach((ringPoints, ringIndex) => {
      const point = ringPoints[i];
      if (ringIndex === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.stroke();
  }

  for (let i = 0; i < RADIAL_POINTS; i += 2) {
    const a = projectedRings[0][i];
    const b = projectedRings[2][(i + 2) % RADIAL_POINTS];
    const c = projectedRings[4][(i + 4) % RADIAL_POINTS];

    ctx.strokeStyle = "rgba(198,166,255,0.22)";
    ctx.lineWidth = Math.max(0.7, scale * 0.0028);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.stroke();
  }

  projectedRings.forEach((points, ringIndex) => {
    points.forEach((point, pointIndex) => {
      const major = pointIndex % 4 === 0;
      const pulse = 0.72 + 0.28 * Math.sin(state.sparklePhase * 1.4 + ringIndex + pointIndex * 0.4);
      const radius = (major ? 3.4 : 2.0) * state.dpr;
      const color = major ? [244, 207, 131] : [141, 216, 255];

      ctx.fillStyle = rgba(color, (major ? 0.80 : 0.44) * pulse);
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, TAU);
      ctx.fill();
    });
  });

  ctx.font = `${Math.max(12, width * 0.018)}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(244, 207, 131, 0.72)";
  ctx.fillText("16 RADIAL COMPASS METRIC · 256 LATTICE ADDRESS FIELD", width * 0.5, height * 0.145);

  ctx.restore();
}

function render(canvas, ctx) {
  const width = canvas.width;
  const height = canvas.height;
  const lens = state.lens;

  ctx.clearRect(0, 0, width, height);

  drawBackground(ctx, width, height, lens);
  drawStars(ctx, width, height);

  if (lens === "lattice") {
    drawLatticeStructure(ctx, width, height);
  } else {
    drawCrystalForm(ctx, width, height);
  }
}

function step(time, canvas, ctx) {
  const dt = state.lastTime ? clamp((time - state.lastTime) / 1000, 0, 0.05) : 0;
  state.lastTime = time;

  resizeCanvas(canvas);
  state.sparklePhase += dt;

  if (!state.dragging) {
    state.yaw += state.velocityYaw;
    state.pitch += state.velocityPitch;
    state.roll += state.velocityRoll;

    const damping = Math.pow(0.948, dt * 60);
    state.velocityYaw *= damping;
    state.velocityPitch *= damping;
    state.velocityRoll *= damping;

    if (Math.abs(state.velocityYaw) < 0.00008) state.velocityYaw = 0;
    if (Math.abs(state.velocityPitch) < 0.00008) state.velocityPitch = 0;
    if (Math.abs(state.velocityRoll) < 0.00004) state.velocityRoll = 0;

    if (state.velocityYaw === 0 && state.velocityPitch === 0) {
      state.yaw += Math.sin(state.sparklePhase * 0.32) * dt * 0.012;
      state.roll += Math.sin(state.sparklePhase * 0.18) * dt * 0.0018;
    }
  }

  state.pitch = clamp(state.pitch, -0.70, 0.70);
  state.roll = clamp(state.roll, -0.20, 0.20);

  render(canvas, ctx);
  state.raf = requestAnimationFrame((next) => step(next, canvas, ctx));
}

function bindPointer(stage) {
  stage.addEventListener("pointerdown", (event) => {
    const now = performance.now();

    if (now - state.lastTap < 320) {
      resetDiamond();
    }

    state.lastTap = now;
    state.dragging = true;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    state.velocityYaw = 0;
    state.velocityPitch = 0;
    state.velocityRoll = 0;

    stage.setPointerCapture?.(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;

    const dx = event.clientX - state.pointerX;
    const dy = event.clientY - state.pointerY;

    state.pointerX = event.clientX;
    state.pointerY = event.clientY;

    state.yaw += dx * 0.0046;
    state.pitch = clamp(state.pitch - dy * 0.0028, -0.70, 0.70);
    state.roll = clamp(state.roll + dx * 0.00028, -0.20, 0.20);

    state.velocityYaw = dx * 0.00150;
    state.velocityPitch = -dy * 0.00084;
    state.velocityRoll = dx * 0.00005;
  }, { passive: true });

  const release = (event) => {
    if (!state.dragging) return;
    state.dragging = false;
    stage.releasePointerCapture?.(event.pointerId);
  };

  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener("pointerleave", release);
}

function resetDiamond() {
  state.yaw = 0.18;
  state.pitch = -0.10;
  state.roll = 0;
  state.velocityYaw = 0;
  state.velocityPitch = 0;
  state.velocityRoll = 0;
  state.sparklePhase = 0;
}

function setLens(nextLens) {
  const lens = nextLens === "lattice" ? "lattice" : "crystal";
  state.lens = lens;

  document.documentElement.dataset.showroomDiamondLens = lens;
  if (document.body) document.body.dataset.showroomDiamondLens = lens;

  document.querySelectorAll("[data-diamond-lens]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.diamondLens === lens ? "true" : "false");
  });

  const title = document.querySelector("[data-diamond-lens-title]");
  const copy = document.querySelector("[data-diamond-lens-copy]");
  const route = document.querySelector("[data-diamond-route-label]");

  if (title) title.textContent = LENS_COPY[lens].title;
  if (copy) copy.textContent = LENS_COPY[lens].copy;
  if (route) route.textContent = LENS_COPY[lens].route;
}

function bindLensControls() {
  document.querySelectorAll("[data-diamond-lens]").forEach((button) => {
    button.addEventListener("click", () => {
      setLens(button.dataset.diamondLens);
    });
  });

  setLens(state.lens);
}

function markRoute() {
  const markers = {
    showroomStatus: "dual-lens-diamond-educational-launchpad",
    showroomContract: SHOWROOM_DIAMOND_STATE.contract,
    showroomPairedHtmlContract: SHOWROOM_DIAMOND_STATE.pairedHtmlContract,
    diamondLock: "CROWN_CUT_256_LATTICE_FIXED_FORM",
    visibleRadialMetric: String(RADIAL_POINTS),
    latticeStates: String(LATTICE_STATES),
    defaultLens: "crystal-form",
    secondaryLens: "lattice-structure",
    lensRule: "toggle-changes-inspection-lens-not-object-identity",
    touchGlideDiamond: "true",
    geometryMutableByTouch: "false",
    inspectionControl: "camera-view-rotation",
    crystalFormSilhouette: "true-cut-diamond-body",
    latticeFormSilhouette: "structural-compass-lattice-field",
    crystalAndLatticeAreVisuallyDistinct: "true",
    diamondPublicRead: "diamond-not-top",
    roundGirdleRemoved: "true",
    visibleCrown: "true",
    topLikeSilhouetteBlocked: "true",
    overMeshedPublicCrystalBlocked: "true",
    launchpadRoutes: "characters,laws,products,globe,gauges",
    lawsCta: "Jump to the Laws page and lock in.",
    productsCommunityPath: "products-serve-community",
    earthRecord: "false",
    generatedImage: "false",
    graphicBox: "false",
    legacyGlobeInheritance: "false"
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = value;
    if (document.body) document.body.dataset[key] = value;
  });
}

function protectIdentity() {
  const title = document.querySelector("title");
  if (title && /Earth/i.test(title.textContent || "")) {
    title.textContent = "Showroom · Diamond Gate Bridge";
  }

  const h1 = document.querySelector("h1");
  if (h1 && /Earth is the real-world reference body/i.test(h1.textContent || "")) {
    h1.textContent = "The Diamond holds the room.";
  }
}

function initShowroomDiamond() {
  markRoute();
  protectIdentity();
  bindLensControls();

  const stage = document.querySelector("[data-showroom-diamond-stage]");
  const canvas = document.querySelector("[data-showroom-diamond-canvas]");

  if (!stage || !canvas) return null;

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return null;

  bindPointer(stage);
  resizeCanvas(canvas);
  render(canvas, ctx);

  state.canvasReady = true;

  if (!state.raf) {
    state.raf = requestAnimationFrame((time) => step(time, canvas, ctx));
  }

  window.DGBShowroomDiamond = Object.freeze({
    ...SHOWROOM_DIAMOND_STATE,
    setLens,
    status() {
      return Object.freeze({
        ...SHOWROOM_DIAMOND_STATE,
        ready: true,
        canvasReady: state.canvasReady,
        fixedForm: true,
        crownCut: true,
        lattice256: true,
        latticeStates: LATTICE_STATES,
        visibleRadialMetric: RADIAL_POINTS,
        activeLens: state.lens,
        lensCopy: LENS_COPY[state.lens],
        crystalFormSilhouette: "true-cut-diamond-body",
        latticeFormSilhouette: "structural-compass-lattice-field",
        crystalAndLatticeAreVisuallyDistinct: true,
        correctedPhysicalRead: "diamond-crystal-not-top-object",
        roundGirdleRemoved: true,
        tableClear: true,
        visibleCrown: true,
        facetedGirdle: true,
        steppedPavilion: true,
        culetPlane: true,
        overMeshedPublicCrystalBlocked: true,
        solidCrystal: true,
        geometryMutableByTouch: false,
        inspectionControl: "camera-view-rotation",
        launchpadRoutes: ["characters", "laws", "products", "globe", "gauges"],
        lawsCta: "Jump to the Laws page and lock in.",
        productsCommunityPath: true,
        momentum: true,
        doubleTapReset: true,
        yaw: state.yaw,
        pitch: state.pitch,
        roll: state.roll,
        generatedImage: false,
        graphicBox: false,
        earthRecord: false,
        legacyGlobeInheritance: false
      });
    }
  });

  return window.DGBShowroomDiamond;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initShowroomDiamond, { once: true });
} else {
  initShowroomDiamond();
}

export { SHOWROOM_DIAMOND_STATE, initShowroomDiamond };
export default SHOWROOM_DIAMOND_STATE;
