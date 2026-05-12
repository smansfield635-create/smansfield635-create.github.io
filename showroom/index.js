// /showroom/index.js
// SHOWROOM_COVER_SOLID_CROWN_SPARKLE_256_FACE_DIAMOND_TNT_v5
// Full-file replacement.
//
// Purpose:
// - Stop the diamond from collapsing into an edge-on thin profile.
// - Solidify one fixed crown-cut diamond form.
// - Preserve fixed structure size.
// - Allow motion only through internal facet phase, light travel, shimmer, and controlled rotational impression.
// - Build a real diamond silhouette: flat table, sloped crown, girdle, pavilion, culet.
// - Make the diamond sparkle like a real diamond.
// - Keep 256-face construct under the hood.
// - Preserve Fibonacci geometry as internal facet rhythm.
// - Keep crystal faces dominant.
// - Keep yellow line prominence reduced.
// - Render by code only.
// - No generated image.
// - No GraphicBox.
// - No visible diagnostics.
// - No visual pass claim.

const CONTRACT = "SHOWROOM_COVER_SOLID_CROWN_SPARKLE_256_FACE_DIAMOND_TNT_v5";
const PREVIOUS_CONTRACT = "SHOWROOM_COVER_ROUND_CROWN_CUT_FIXED_256_FACE_DIAMOND_TNT_v4";
const ROUTE = "/showroom/";

const TOTAL_FACES = 256;
const SECTORS = 32;
const RINGS = 9;
const FIBONACCI_SEQUENCE = Object.freeze([1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]);

const GENERATED_IMAGE = false;
const GRAPHIC_BOX = false;
const VISUAL_PASS_CLAIM = false;
const DIAGNOSTICS_VISIBLE = false;

const STRUCTURE_SIZE_LOCKED = true;
const MOTION_ONLY = true;
const SCALE_LOCK = 1;
const SILHOUETTE_LOCKED = true;
const EDGE_ON_COLLAPSE_ALLOWED = false;

const MOBILE = window.matchMedia?.("(max-width: 760px)")?.matches === true;
const REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
const DPR = MOBILE ? 1 : Math.min(window.devicePixelRatio || 1, 1.35);
const FRAME_MS = MOBILE ? 46 : 34;

const state = {
  canvas: null,
  context: null,
  host: null,
  stage: null,

  motionPhase: 0,
  lightPhase: 0,
  dragPhase: 0,
  pitchBias: 0,

  dragging: false,
  pointerId: null,
  dragStartX: 0,
  dragStartY: 0,
  dragStartPhase: 0,
  dragStartPitchBias: 0,

  raf: 0,
  lastFrameAt: 0,
  active: true,
  booted: false
};

let geometry = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hashUnit(index, salt = 0) {
  const x = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function fibonacciForFace(index) {
  const value = FIBONACCI_SEQUENCE[index % FIBONACCI_SEQUENCE.length];
  const next = FIBONACCI_SEQUENCE[(index + 1) % FIBONACCI_SEQUENCE.length];

  return {
    value,
    next,
    ratio: value / next,
    density: clamp(value / 233, 0.004, 1),
    phase: ((value % SECTORS) / SECTORS) * Math.PI * 2
  };
}

function ringProfile() {
  return [
    // Eight bands × 32 sectors = 256 faces.
    // Silhouette is fixed so the diamond cannot collapse into a side profile.
    { y: -0.60, rx: 0.36, role: "flat-table" },
    { y: -0.54, rx: 0.52, role: "star-crown" },
    { y: -0.43, rx: 0.74, role: "upper-crown" },
    { y: -0.25, rx: 0.98, role: "main-crown" },
    { y: -0.06, rx: 1.10, role: "girdle" },
    { y:  0.20, rx: 0.86, role: "upper-pavilion" },
    { y:  0.46, rx: 0.56, role: "lower-pavilion" },
    { y:  0.68, rx: 0.22, role: "near-culet" },
    { y:  0.82, rx: 0.025, role: "culet" }
  ];
}

function buildGeometry() {
  if (geometry) return geometry;

  const profiles = ringProfile();
  const vertices = [];

  for (let ring = 0; ring < RINGS; ring += 1) {
    const profile = profiles[ring];

    for (let sector = 0; sector < SECTORS; sector += 1) {
      const fib = fibonacciForFace(ring * SECTORS + sector);
      const theta = (sector / SECTORS) * Math.PI * 2;
      const facetPulse = 0.996 + Math.sin(theta * 8 + fib.value * 0.0618) * 0.004;

      vertices.push({
        ring,
        sector,
        role: profile.role,
        theta,
        x: Math.cos(theta) * profile.rx * facetPulse,
        y: profile.y,
        z: Math.sin(theta),
        fib
      });
    }
  }

  const faces = [];

  for (let ring = 0; ring < RINGS - 1; ring += 1) {
    for (let sector = 0; sector < SECTORS; sector += 1) {
      const nextSector = (sector + 1) % SECTORS;
      const index = ring * SECTORS + sector;

      faces.push({
        index,
        ring,
        sector,
        role: profiles[ring].role,
        nextRole: profiles[ring + 1].role,
        fib: fibonacciForFace(index),
        vertices: [
          vertices[ring * SECTORS + sector],
          vertices[ring * SECTORS + nextSector],
          vertices[(ring + 1) * SECTORS + nextSector],
          vertices[(ring + 1) * SECTORS + sector]
        ]
      });
    }
  }

  geometry = Object.freeze({
    vertices: Object.freeze(vertices),
    faces: Object.freeze(faces),
    profiles: Object.freeze(profiles)
  });

  return geometry;
}

function findHost() {
  const explicit =
    document.querySelector("[data-showroom-diamond-mount]") ||
    document.querySelector("[data-256-diamond-mount]") ||
    document.getElementById("showroomDiamondMount") ||
    document.getElementById("diamondLatticeMount");

  if (explicit) return explicit;

  const existingCanvas =
    document.querySelector("[data-showroom-diamond-canvas]") ||
    document.querySelector("[data-256-diamond-canvas]") ||
    document.getElementById("showroomDiamondCanvas");

  if (existingCanvas?.parentElement) return existingCanvas.parentElement;

  const candidates = Array.from(document.querySelectorAll("section, article, div"));

  return (
    candidates.find((node) => {
      const text = node.textContent || "";
      return (
        text.includes("256-Face") ||
        text.includes("256 faces") ||
        text.includes("Enclosed Diamond") ||
        text.includes("Crystallized") ||
        text.includes("Crown-Cut") ||
        text.includes("Fibonacci geometry")
      );
    }) ||
    document.querySelector("main") ||
    document.body
  );
}

function ensureStage(host) {
  let stage =
    host.querySelector("[data-showroom-crystal-diamond-stage]") ||
    host.querySelector("[data-showroom-diamond-stage]");

  if (!stage) {
    stage = document.createElement("div");
    stage.setAttribute("data-showroom-crystal-diamond-stage", "true");

    const firstCanvas = host.querySelector("canvas");
    const oldVisualBox =
      host.querySelector("[data-fibonacci-diamond-stage]") ||
      host.querySelector("[data-256-face-diamond]");

    if (firstCanvas?.parentElement) {
      firstCanvas.parentElement.replaceChildren(stage);
    } else if (oldVisualBox?.parentElement) {
      oldVisualBox.replaceWith(stage);
    } else {
      host.appendChild(stage);
    }
  }

  stage.dataset.contract = CONTRACT;
  stage.dataset.totalFaces = String(TOTAL_FACES);
  stage.dataset.solidForm = "true";
  stage.dataset.silhouetteLocked = "true";
  stage.dataset.edgeOnCollapseAllowed = "false";
  stage.dataset.rounderDiamond = "true";
  stage.dataset.flatTable = "true";
  stage.dataset.crownTop = "true";
  stage.dataset.crownAppearance = "real-diamond-cut";
  stage.dataset.sparkle = "active";
  stage.dataset.structureSizeLocked = "true";
  stage.dataset.motionOnly = "true";
  stage.dataset.zoomManipulation = "false";
  stage.dataset.fibonacciGeometry = "internal";
  stage.dataset.yellowLineProminence = "reduced";
  stage.dataset.faceDefinedEdges = "true";
  stage.dataset.generatedImage = "false";
  stage.dataset.graphicBox = "false";
  stage.dataset.visibleDiagnostics = "false";

  return stage;
}

function ensureCanvas(stage) {
  let canvas =
    stage.querySelector("[data-showroom-crystal-diamond-canvas]") ||
    stage.querySelector("canvas");

  if (!canvas) {
    canvas = document.createElement("canvas");
    stage.replaceChildren(canvas);
  }

  canvas.setAttribute("data-showroom-crystal-diamond-canvas", "true");
  canvas.setAttribute("aria-label", "Solid fixed-size crown-cut sparkling 256-face diamond");
  canvas.setAttribute("role", "img");
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  canvas.style.aspectRatio = "1 / 1";
  canvas.style.touchAction = "none";
  canvas.style.transform = "none";

  return canvas;
}

function ensureStyle() {
  if (document.getElementById("showroom-solid-crown-sparkle-diamond-style-v5")) return;

  const style = document.createElement("style");
  style.id = "showroom-solid-crown-sparkle-diamond-style-v5";
  style.textContent = `
    [data-showroom-crystal-diamond-stage] {
      width: 100%;
      min-height: clamp(390px, 82vw, 760px);
      display: grid;
      place-items: center;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(142, 190, 255, 0.18);
      border-radius: 28px;
      background:
        radial-gradient(circle at 50% 54%, rgba(210, 235, 255, 0.14), transparent 19rem),
        radial-gradient(circle at 50% 44%, rgba(244, 191, 96, 0.055), transparent 21rem),
        linear-gradient(180deg, rgba(7, 13, 30, 1), rgba(2, 5, 12, 1));
      box-shadow:
        inset 0 0 54px rgba(143, 240, 195, 0.08),
        0 24px 70px rgba(0, 0, 0, 0.34);
      contain: layout paint style;
      touch-action: none;
    }

    [data-showroom-crystal-diamond-stage]::before {
      content: "SOLID CROWN CUT · SPARKLING";
      position: absolute;
      top: 16px;
      left: 16px;
      z-index: 2;
      min-height: 31px;
      display: inline-flex;
      align-items: center;
      padding: 7px 11px;
      border: 1px solid rgba(244, 191, 96, 0.22);
      border-radius: 999px;
      background: rgba(4, 9, 18, 0.70);
      color: #f4bf60;
      font: 900 0.72rem Inter, ui-sans-serif, system-ui, sans-serif;
      letter-spacing: 0.10em;
      pointer-events: none;
      backdrop-filter: blur(12px);
    }

    [data-showroom-crystal-diamond-canvas] {
      width: 100%;
      max-width: 980px;
      aspect-ratio: 1 / 1;
      touch-action: none;
      transform: none !important;
      contain: strict;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }

    @media (max-width: 560px) {
      [data-showroom-crystal-diamond-stage] {
        min-height: clamp(360px, 88vw, 620px);
        border-radius: 20px;
      }

      [data-showroom-crystal-diamond-stage]::before {
        top: 12px;
        left: 12px;
        font-size: 0.62rem;
      }
    }
  `;

  document.head.appendChild(style);
}

function updateNearbyCopy(host) {
  const headings = Array.from(host.querySelectorAll("h1, h2, h3"));
  const targetHeading = headings.find((heading) => {
    const text = heading.textContent || "";
    return text.includes("256") || text.includes("Diamond") || text.includes("diamond") || text.includes("Crystallized");
  });

  if (targetHeading) {
    targetHeading.textContent = "Solid Crown-Cut 256-Face Sparkling Diamond";
  }

  const paragraphs = Array.from(host.querySelectorAll("p"));
  const targetParagraph = paragraphs.find((paragraph) => {
    const text = paragraph.textContent || "";
    return text.includes("Fibonacci") || text.includes("256") || text.includes("diamond");
  });

  if (targetParagraph) {
    targetParagraph.textContent =
      "The visible object is one solid crown-cut crystal diamond. The silhouette is fixed so the form cannot collapse into an edge profile. Motion changes rotation, light, sparkle, and internal refraction only.";
  }
}

function sizeCanvas() {
  if (!state.canvas) return;

  const rect = state.canvas.getBoundingClientRect();
  const cssWidth = Math.max(320, Math.floor(rect.width || state.canvas.clientWidth || 720));
  const cssHeight = Math.max(320, Math.floor(rect.height || state.canvas.clientHeight || cssWidth));

  const width = Math.floor(cssWidth * DPR);
  const height = Math.floor(cssHeight * DPR);

  if (state.canvas.width !== width || state.canvas.height !== height) {
    state.canvas.width = width;
    state.canvas.height = height;
  }

  state.context = state.canvas.getContext("2d", { alpha: false });
}

function projectSilhouette(vertex, width, height, scale) {
  const wobble = Math.sin(vertex.theta + state.motionPhase) * 0.026;
  const breathing = 1 + wobble * (vertex.role.includes("pavilion") ? 0.55 : 0.28);
  const pitchOffset = state.pitchBias * 0.0038;

  return {
    x: width * 0.5 + vertex.x * scale * breathing,
    y: height * 0.545 + (vertex.y + pitchOffset * Math.sin(vertex.theta)) * scale,
    z: Math.cos(vertex.theta + state.motionPhase) * 0.36 + Math.sin(vertex.ring * 0.8) * 0.08,
    theta: vertex.theta,
    ring: vertex.ring,
    sector: vertex.sector,
    role: vertex.role,
    fib: vertex.fib
  };
}

function polygonBounds(points) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return { minX, minY, maxX, maxY };
}

function drawBackground(context, width, height) {
  const gradient = context.createRadialGradient(
    width * 0.50,
    height * 0.48,
    width * 0.05,
    width * 0.50,
    height * 0.52,
    width * 0.78
  );

  gradient.addColorStop(0, "#111d35");
  gradient.addColorStop(0.45, "#071226");
  gradient.addColorStop(1, "#01030a");

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalAlpha = MOBILE ? 0.23 : 0.35;

  const starCount = MOBILE ? 42 : 76;
  for (let i = 0; i < starCount; i += 1) {
    const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 49.61) * 0.5 + 0.5) * height;
    const radius = 0.55 + ((i * 7) % 11) / 22;

    context.beginPath();
    context.fillStyle = i % 11 === 0 ? "rgba(244,191,96,0.36)" : "rgba(225,238,255,0.40)";
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function drawCaustic(context, width, height, scale) {
  context.save();

  const cx = width * 0.5;
  const cy = height * 0.82;
  const radius = scale * 0.52;

  const glow = context.createRadialGradient(cx, cy, radius * 0.05, cx, cy, radius);
  glow.addColorStop(0, "rgba(225,248,255,0.22)");
  glow.addColorStop(0.28, "rgba(244,191,96,0.07)");
  glow.addColorStop(1, "rgba(244,191,96,0)");

  context.fillStyle = glow;
  context.beginPath();
  context.ellipse(cx, cy, radius * 1.12, radius * 0.12, 0, 0, Math.PI * 2);
  context.fill();

  context.restore();
}

function facetLight(face, points) {
  const center = points.reduce(
    (sum, point) => ({
      x: sum.x + point.x / points.length,
      y: sum.y + point.y / points.length,
      z: sum.z + point.z / points.length
    }),
    { x: 0, y: 0, z: 0 }
  );

  const tableBoost = face.role === "flat-table" ? 0.24 : 0;
  const crownBoost =
    face.role === "star-crown" ||
    face.role === "upper-crown" ||
    face.role === "main-crown"
      ? 0.16
      : 0;
  const pavilionBoost = face.role.includes("pavilion") ? 0.07 : 0;
  const bandBias = 1 - Math.abs(face.ring - 3.1) / 5;
  const fib = face.fib;
  const sparkleWave = Math.sin(face.sector * 0.92 + fib.phase + state.lightPhase) * 0.16;

  return clamp(
    0.36 +
      center.z * 0.34 +
      bandBias * 0.10 +
      tableBoost +
      crownBoost +
      pavilionBoost +
      sparkleWave +
      fib.density * 0.040,
    0.08,
    1.24
  );
}

function drawFacet(context, face, points, light) {
  if (points.length < 3) return;

  const bounds = polygonBounds(points);
  const fib = face.fib;

  const alpha = clamp(0.34 + light * 0.50 + fib.density * 0.030, 0.24, 0.92);
  const warm = face.role === "girdle"
    ? clamp(0.018 + fib.ratio * 0.022, 0.014, 0.052)
    : clamp(0.006 + fib.ratio * 0.012, 0.006, 0.034);
  const icy = clamp(0.48 + light * 0.36, 0.34, 0.88);
  const shadow = clamp(0.08 + (1 - light) * 0.26, 0.045, 0.30);

  const gradient = context.createLinearGradient(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
  gradient.addColorStop(0, `rgba(255,255,255,${clamp(0.24 + light * 0.36, 0.14, 0.64)})`);
  gradient.addColorStop(0.23, `rgba(215,244,255,${icy})`);
  gradient.addColorStop(0.48, `rgba(112,150,212,${clamp(0.15 + light * 0.16, 0.10, 0.34)})`);
  gradient.addColorStop(0.72, `rgba(12,25,48,${shadow})`);
  gradient.addColorStop(1, `rgba(244,191,96,${warm})`);

  context.save();
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i += 1) {
    context.lineTo(points[i].x, points[i].y);
  }

  context.closePath();

  context.fillStyle = gradient;
  context.globalAlpha = alpha;
  context.fill();

  context.globalAlpha = clamp(0.09 + light * 0.15, 0.07, 0.24);
  context.strokeStyle = light > 0.74 ? "rgba(255,255,255,0.56)" : "rgba(202,224,255,0.24)";
  context.lineWidth = light > 0.78 ? 0.78 * DPR : 0.36 * DPR;
  context.stroke();

  context.restore();
}

function drawTablePlane(context, ringsProjected) {
  const table = ringsProjected.get(0);
  if (!table || table.length < 3) return;

  context.save();
  context.globalCompositeOperation = "lighter";

  const bounds = polygonBounds(table);
  const gradient = context.createLinearGradient(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
  gradient.addColorStop(0, "rgba(255,255,255,0.62)");
  gradient.addColorStop(0.34, "rgba(220,245,255,0.38)");
  gradient.addColorStop(0.70, "rgba(114,150,205,0.16)");
  gradient.addColorStop(1, "rgba(255,255,255,0.46)");

  context.beginPath();

  for (let i = 0; i < table.length; i += 1) {
    const point = table[i];
    if (i === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  }

  context.closePath();
  context.fillStyle = gradient;
  context.globalAlpha = 0.54;
  context.fill();

  context.strokeStyle = "rgba(255,255,255,0.78)";
  context.lineWidth = Math.max(1.0, 1.12 * DPR);
  context.globalAlpha = 0.72;
  context.stroke();

  context.restore();
}

function drawCrownFacetCuts(context, ringsProjected) {
  const table = ringsProjected.get(0);
  const crown = ringsProjected.get(2);
  const main = ringsProjected.get(3);
  const girdle = ringsProjected.get(4);

  if (!table || !crown || !main || !girdle) return;

  context.save();
  context.globalCompositeOperation = "lighter";
  context.lineCap = "round";

  for (let sector = 0; sector < SECTORS; sector += MOBILE ? 4 : 2) {
    const t = table[sector];
    const c = crown[(sector + 1) % SECTORS];
    const m = main[(sector + 2) % SECTORS];
    const g = girdle[(sector + 3) % SECTORS];

    context.strokeStyle = "rgba(235,248,255,0.17)";
    context.lineWidth = Math.max(0.44, 0.50 * DPR);
    context.beginPath();
    context.moveTo(t.x, t.y);
    context.lineTo(c.x, c.y);
    context.lineTo(m.x, m.y);
    context.lineTo(g.x, g.y);
    context.stroke();
  }

  context.restore();
}

function drawCrystalFaceEdges(context, faces) {
  context.save();
  context.globalCompositeOperation = "lighter";
  context.lineCap = "round";
  context.lineJoin = "round";

  const stride = MOBILE ? 5 : 4;

  for (let i = 0; i < faces.length; i += stride) {
    const item = faces[i];
    if (item.depth < -0.18) continue;

    const points = item.points;
    const light = item.light;
    const alpha = clamp(0.026 + light * 0.072, 0.018, 0.12);

    context.strokeStyle = `rgba(226,244,255,${alpha})`;
    context.lineWidth = Math.max(0.34, DPR * 0.44);

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let p = 1; p < points.length; p += 1) {
      context.lineTo(points[p].x, points[p].y);
    }

    context.closePath();
    context.stroke();
  }

  context.restore();
}

function drawOuterCutLines(context, ringsProjected) {
  context.save();
  context.globalCompositeOperation = "lighter";
  context.lineCap = "round";

  const importantRings = [0, 1, 3, 4, 8];

  for (const ring of importantRings) {
    const points = ringsProjected.get(ring);
    if (!points) continue;

    context.beginPath();

    for (let i = 0; i < points.length; i += 1) {
      const point = points[i];
      if (i === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    }

    context.closePath();

    if (ring === 0) {
      context.strokeStyle = "rgba(255,255,255,0.72)";
      context.lineWidth = Math.max(0.95, 1.08 * DPR);
    } else if (ring === 1 || ring === 3) {
      context.strokeStyle = "rgba(235,248,255,0.42)";
      context.lineWidth = Math.max(0.90, 1.00 * DPR);
    } else if (ring === 4) {
      context.strokeStyle = "rgba(225,243,255,0.36)";
      context.lineWidth = Math.max(1.0, 1.08 * DPR);
    } else {
      context.strokeStyle = "rgba(244,191,96,0.16)";
      context.lineWidth = Math.max(0.70, 0.76 * DPR);
    }

    context.stroke();
  }

  context.restore();
}

function drawPrismaticFlashes(context, projectedVertices, time) {
  context.save();
  context.globalCompositeOperation = "lighter";

  const flashCount = MOBILE ? 7 : 12;

  for (let i = 0; i < flashCount; i += 1) {
    const seed = i * 19 + Math.floor(state.lightPhase * 8);
    const index = (seed * 17 + i * 29) % projectedVertices.length;
    const vertex = projectedVertices[index];
    if (!vertex || vertex.z < -0.08) continue;

    const pulse = 0.5 + Math.sin(time * 0.006 + i * 2.13) * 0.5;
    const size = (MOBILE ? 8 : 11) * DPR * (0.70 + pulse * 0.75);
    const hue = i % 4;
    const color =
      hue === 0 ? "255,255,255" :
      hue === 1 ? "162,220,255" :
      hue === 2 ? "244,191,96" :
      "190,170,255";

    const alpha = clamp(0.16 + pulse * 0.42 + vertex.z * 0.12, 0.10, 0.72);

    context.strokeStyle = `rgba(${color},${alpha})`;
    context.lineWidth = Math.max(0.8, DPR * 0.9);
    context.lineCap = "round";

    context.beginPath();
    context.moveTo(vertex.x - size, vertex.y);
    context.lineTo(vertex.x + size, vertex.y);
    context.moveTo(vertex.x, vertex.y - size);
    context.lineTo(vertex.x, vertex.y + size);
    context.stroke();

    if (!MOBILE && i % 2 === 0) {
      context.beginPath();
      context.moveTo(vertex.x - size * 0.55, vertex.y - size * 0.55);
      context.lineTo(vertex.x + size * 0.55, vertex.y + size * 0.55);
      context.moveTo(vertex.x + size * 0.55, vertex.y - size * 0.55);
      context.lineTo(vertex.x - size * 0.55, vertex.y + size * 0.55);
      context.stroke();
    }
  }

  context.restore();
}

function drawSoftSparkleDust(context, width, height, time) {
  context.save();
  context.globalCompositeOperation = "lighter";

  const count = MOBILE ? 22 : 36;

  for (let i = 0; i < count; i += 1) {
    const x = width * (0.22 + hashUnit(i, 17) * 0.56);
    const y = height * (0.24 + hashUnit(i, 31) * 0.56);
    const pulse = 0.5 + Math.sin(time * 0.004 + i * 1.47) * 0.5;
    const alpha = 0.025 + pulse * 0.10;
    const radius = (0.8 + hashUnit(i, 44) * 1.8) * DPR;

    context.beginPath();
    context.fillStyle = i % 5 === 0 ? `rgba(244,191,96,${alpha})` : `rgba(235,248,255,${alpha})`;
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function render(time = 0) {
  if (!state.context || !state.canvas) return;

  const canvas = state.canvas;
  const context = state.context;
  const width = canvas.width;
  const height = canvas.height;
  const scale = Math.min(width, height) * 0.345 * SCALE_LOCK;
  const model = buildGeometry();

  drawBackground(context, width, height);
  drawSoftSparkleDust(context, width, height, time);
  drawCaustic(context, width, height, scale);

  const projectedVertices = model.vertices.map((vertex) => projectSilhouette(vertex, width, height, scale));

  const ringsProjected = new Map();

  for (const vertex of projectedVertices) {
    if (!ringsProjected.has(vertex.ring)) ringsProjected.set(vertex.ring, []);
    ringsProjected.get(vertex.ring).push(vertex);
  }

  const projectedFaces = model.faces.map((face) => {
    const points = face.vertices.map((vertex) => {
      const index = vertex.ring * SECTORS + vertex.sector;
      return projectedVertices[index];
    });

    const depth = points.reduce((sum, point) => sum + point.z, 0) / points.length;
    const light = facetLight(face, points);

    return { face, points, depth, light };
  });

  projectedFaces.sort((a, b) => a.depth - b.depth);

  context.save();

  for (const item of projectedFaces) {
    drawFacet(context, item.face, item.points, item.light);
  }

  drawTablePlane(context, ringsProjected);
  drawCrownFacetCuts(context, ringsProjected);
  drawCrystalFaceEdges(context, projectedFaces);
  drawOuterCutLines(context, ringsProjected);
  drawPrismaticFlashes(context, projectedVertices, time);

  context.restore();

  stampDocument();
}

function requestFrame(time = 0) {
  if (!state.active) return;

  const elapsed = time - state.lastFrameAt;

  if (elapsed >= FRAME_MS) {
    state.lastFrameAt = time;

    if (!REDUCED_MOTION) {
      state.motionPhase += MOBILE ? 0.006 : 0.009;
      state.lightPhase += MOBILE ? 0.036 : 0.052;
    }

    render(time);
  }

  state.raf = window.requestAnimationFrame(requestFrame);
}

function wireInteraction() {
  const canvas = state.canvas;
  if (!canvas || canvas.dataset.solidCrownSparkleDiamondInteractionBound === "true") return;

  canvas.dataset.solidCrownSparkleDiamondInteractionBound = "true";

  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.dragStartX = event.clientX;
    state.dragStartY = event.clientY;
    state.dragStartPhase = state.motionPhase;
    state.dragStartPitchBias = state.pitchBias;
    canvas.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.dragging || event.pointerId !== state.pointerId) return;

    const dx = event.clientX - state.dragStartX;
    const dy = event.clientY - state.dragStartY;

    state.motionPhase = state.dragStartPhase + dx * 0.009;
    state.lightPhase += dx * 0.003;
    state.pitchBias = clamp(state.dragStartPitchBias - dy * 0.18, -18, 18);

    render(performance.now());
    event.preventDefault();
  }, { passive: false });

  const finish = (event) => {
    if (event.pointerId !== state.pointerId) return;

    state.dragging = false;
    state.pointerId = null;
    canvas.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  };

  canvas.addEventListener("pointerup", finish, { passive: false });
  canvas.addEventListener("pointercancel", finish, { passive: false });

  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
  }, { passive: false });
}

function stampDocument() {
  const root = document.documentElement;

  root.dataset.showroomDiamondReceipt = CONTRACT;
  root.dataset.showroomDiamondPreviousReceipt = PREVIOUS_CONTRACT;
  root.dataset.showroomDiamondRoute = ROUTE;
  root.dataset.showroomDiamondCrystallized = "true";
  root.dataset.showroomDiamondSolidForm = "true";
  root.dataset.showroomDiamondSilhouetteLocked = "true";
  root.dataset.showroomDiamondEdgeOnCollapseAllowed = "false";
  root.dataset.showroomDiamondRounder = "true";
  root.dataset.showroomDiamondFlatTable = "true";
  root.dataset.showroomDiamondCrownTop = "true";
  root.dataset.showroomDiamondSparkle = "active";
  root.dataset.showroomDiamondCrownAppearance = "real-diamond-cut";
  root.dataset.showroomDiamondFaces = String(TOTAL_FACES);
  root.dataset.showroomDiamondStructureSizeLocked = "true";
  root.dataset.showroomDiamondScaleLock = String(SCALE_LOCK);
  root.dataset.showroomDiamondMotionOnly = "true";
  root.dataset.showroomDiamondZoomManipulation = "false";
  root.dataset.showroomDiamondVisibleNodes = "subtle";
  root.dataset.showroomDiamondYellowLineProminence = "reduced";
  root.dataset.showroomDiamondFaceDefinedEdges = "true";
  root.dataset.showroomDiamondFibonacciGeometry = "internal";
  root.dataset.showroomDiamondFibonacciSequence = FIBONACCI_SEQUENCE.join(",");
  root.dataset.showroomDiamondRenderedByCode = "true";
  root.dataset.generatedImage = String(GENERATED_IMAGE);
  root.dataset.graphicBox = String(GRAPHIC_BOX);
  root.dataset.visualPassClaim = String(VISUAL_PASS_CLAIM);
  root.dataset.visibleDiagnostics = String(DIAGNOSTICS_VISIBLE);
  root.dataset.runtimeBudget = MOBILE ? "mobile-capped" : "desktop-capped";
  root.dataset.dprCap = String(DPR);
}

function getShowroomDiamondStatus() {
  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    route: ROUTE,
    crystallized: true,
    solidForm: true,
    silhouetteLocked: SILHOUETTE_LOCKED,
    edgeOnCollapseAllowed: EDGE_ON_COLLAPSE_ALLOWED,
    rounder: true,
    flatTable: true,
    crownTop: true,
    sparkle: "active",
    crownAppearance: "real-diamond-cut",
    totalFaces: TOTAL_FACES,
    rings: RINGS,
    sectors: SECTORS,
    structureSizeLocked: STRUCTURE_SIZE_LOCKED,
    scaleLock: SCALE_LOCK,
    motionOnly: MOTION_ONLY,
    zoomManipulation: false,
    visibleNodes: "subtle",
    yellowLineProminence: "reduced",
    faceDefinedEdges: true,
    fibonacciGeometry: "internal",
    fibonacciSequence: [...FIBONACCI_SEQUENCE],
    generatedImage: GENERATED_IMAGE,
    graphicBox: GRAPHIC_BOX,
    visualPassClaim: VISUAL_PASS_CLAIM,
    diagnosticsVisible: DIAGNOSTICS_VISIBLE,
    mobile: MOBILE,
    dprCap: DPR,
    motionPhase: state.motionPhase,
    lightPhase: state.lightPhase,
    booted: state.booted
  };
}

function exposeApi() {
  const api = {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    render,
    status: getShowroomDiamondStatus,
    getStatus: getShowroomDiamondStatus,
    getShowroomDiamondStatus
  };

  window.DGBShowroomDiamond = api;
  window.ShowroomDiamond = api;
  window.SHOWROOM_DIAMOND_RECEIPT = CONTRACT;
}

function boot() {
  ensureStyle();

  const host = findHost();
  const stage = ensureStage(host);
  const canvas = ensureCanvas(stage);

  state.host = host;
  state.stage = stage;
  state.canvas = canvas;

  updateNearbyCopy(host);
  sizeCanvas();
  wireInteraction();
  exposeApi();
  stampDocument();

  state.booted = true;

  render(performance.now());

  if (state.raf) window.cancelAnimationFrame(state.raf);
  state.raf = window.requestAnimationFrame(requestFrame);
}

window.addEventListener("resize", () => {
  window.clearTimeout(window.__showroomDiamondResizeTimer);
  window.__showroomDiamondResizeTimer = window.setTimeout(() => {
    sizeCanvas();
    render(performance.now());
  }, 180);
}, { passive: true });

document.addEventListener("visibilitychange", () => {
  state.active = document.visibilityState !== "hidden";

  if (!state.active && state.raf) {
    window.cancelAnimationFrame(state.raf);
    state.raf = 0;
  }

  if (state.active && !state.raf) {
    state.lastFrameAt = 0;
    state.raf = window.requestAnimationFrame(requestFrame);
  }
}, { passive: true });

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  PREVIOUS_CONTRACT,
  ROUTE,
  TOTAL_FACES,
  SECTORS,
  RINGS,
  FIBONACCI_SEQUENCE,
  STRUCTURE_SIZE_LOCKED,
  MOTION_ONLY,
  SCALE_LOCK,
  SILHOUETTE_LOCKED,
  EDGE_ON_COLLAPSE_ALLOWED,
  GENERATED_IMAGE,
  GRAPHIC_BOX,
  VISUAL_PASS_CLAIM,
  render,
  getShowroomDiamondStatus
};

export default {
  contract: CONTRACT,
  receipt: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  render,
  status: getShowroomDiamondStatus,
  getStatus: getShowroomDiamondStatus,
  getShowroomDiamondStatus
};
